# Database index를 통한 API 성능 개선

## 목적

현재 개발된 어플리케이션에서 수행하는 쿼리들을 정리하고 분석해 인덱스 추가를 통한 성능 개선 과정들을 다룹니다.

## DB Index?

특정한 데이터 row에 대한 색인(Index) 미리 가지고 있다가 조건에 맞는 것을 조회 시 빠르게 가져오게 하는 것을 말합니다.

## B-Tree 구조

- 루트 노드, 브랜치 노드, 리프 노드로 구성되어 있다.
- 항상 균형 잡힌 트리로 구성되어 성능에 안정성을 가질 수 있다.
- 각 노드는 여러 개의 키와 포인터를 가진다.
- 리프 노드는 데이터 주소를 가리키는 포인터를 가진다.

## B-Tree 장점

- 안정적인 성능: 조회, 삽입, 삭제 모두 O(log n) 시간 복잡도 보장
- 효율적인 저장 공간 사용: 하나의 노드에 여러 키를 저장 가능
- 디스크 접근 최소화: 한 노드에서 여러 데이터 접근 가능

## Problem (index X 상황)

현재 어플리케이션은 아래와 같은 상황입니다.

- PK를 제외한 Where 절 검색 시 slow query가 발생한다.
- 대용량 데이터 처리 시 전체 테이블 스캔을 수행해서 조회 속도가 느리다.
- 과도한 Disk I/O로 시스템 부하가 증가한다.

## 쿼리 분석 및 Index 적용

각 쿼리에 여러 인덱스를 추가하여 테스트를 진행해보며 최적의 인덱스를 적용하려고 함.

### 유저 조회

- 유저를 이메일로 조회하는 경우를 테스트

```
// 코드
async findOneByEmail(email: string): Promise<Nullable<UserDomain>> {
    const entity = await this.userRepository.findOne({ where: { email } });

    return entity ? UserMapper.toDomain(entity) : null;
  }
```

이메일이 100%의 카디널리티(즉, 모든 이메일이 고유)라고 하더라도, 인덱스가 없는 경우에는 email 필드로의 조회는 테이블 전체를 탐색하는 풀 스캔을 발생시킵니다.  
이로 인해 테이블의 행 수가 많아질수록 조회 성능이 저하될 수 있겠다고 생각했습니다.

**실행 쿼리**

```sql
SELECT * FROM users
WHERE email = test100000@gmail.com;
```

**더미 생성**

```sql
-- 100만개의 유저 데이터 생성

INSERT INTO user_entity (username, email, password, created_at, updated_at, status, role)
SELECT
    'test_user_' || i,
    'test' || i || '@example.com',
    '1234',
    now(),
    now(),
    'inactive',
    'viewer'
FROM generate_series(1, 1000000) AS i;
```

**성능 확인 (Explain)**

```sql

EXPLAIN ANALYZE SELECT * FROM user_entity WHERE email = 'test10014@example.com';
```

```
Index Scan using "UQ_415c35b9b3b6fe45a3b065030f5" on user_entity  (cost=0.56..8.58 rows=1 width=85) (actual time=0.545..0.548 rows=1 loops=1)
  Index Cond: ((email)::text = 'test10014@example.com'::text)
Planning Time: 2.147 ms
Execution Time: 0.770 ms
```

UNIQUE 제약 조건은 내부적으로 자동으로 인덱스를 생성합니다.  
따라서 UNIQUE 제약 조건이 있는 필드에서 조회할 때는 해당 인덱스를 사용하여 조회되었었습니다.  
지금 Index Scan이 표시된 이유는 UNIQUE 제약 조건에 의해 생성된 인덱스를 사용하고 있었습니다.

**결론**

unique = true인 컬럼은 자동적으로 인덱스를 설정한다.

### 예약된 방송 목록 조회

- 실시간 방송을 조회하는 경우를 테스트

**더미 생성**

```sql
-- 방송 100만개 생성
INSERT INTO broadcast_entity (user_id, title, description, status, viewer_count, scheduled_time, tags, thumbnail_url)
SELECT
    i,
    'Broadcast Title ' || i,
    'This is a dummy broadcast description for broadcast number ' || i,
    CASE
        WHEN i % 3 = 0 THEN 'scheduled'::broadcast_entity_status_enum
        WHEN i % 3 = 1 THEN 'live'::broadcast_entity_status_enum
        ELSE 'off_air'::broadcast_entity_status_enum
    END,
    1,
    now() + (i % 1000) * interval '1 day',
    ARRAY['tag' || (i % 5 + 1), 'tag' || (i % 3 + 1)],
    'http://example.com/thumbnail_' || i || '.jpg'
FROM generate_series(1, 1000000) AS i;
```

**생성 전 explain**

```sql
EXPLAIN ANALYZE SELECT * FROM broadcast_entity WHERE status = 'live';
```

```
//결과

Seq Scan on broadcast_entity  (cost=0.00..65127.79 rows=333361 width=166) (actual time=0.141..431.480 rows=333328 loops=1)
  Filter: (status = 'live'::broadcast_entity_status_enum)
  Rows Removed by Filter: 666655
Planning Time: 0.356 ms
Execution Time: 441.303 ms
```

**인덱스 생성**

```sql
CREATE INDEX idx_broadcast_status ON broadcast_entity (status);
```

**생성 후 explain**

```sql
EXPLAIN ANALYZE SELECT * FROM broadcast_entity WHERE status = 'live';
```

```
Bitmap Heap Scan on broadcast_entity  (cost=3719.97..60514.99 rows=333361 width=166) (actual time=36.393..382.110 rows=333328 loops=1)
  Recheck Cond: (status = 'live'::broadcast_entity_status_enum)
  Heap Blocks: exact=26314
  ->  Bitmap Index Scan on idx_broadcast_status  (cost=0.00..3636.63 rows=333361 width=0) (actual time=32.310..32.311 rows=333328 loops=1)
        Index Cond: (status = 'live'::broadcast_entity_status_enum)
Planning Time: 1.474 ms
Execution Time: 391.144 ms
```

**비교**

- 인덱스 생성 전: Seq Scan(Sequential Scan)이 사용되었으며, 실행 시간이 441.303 ms이었습니다. 이는 테이블 전체를 순차적으로 스캔하면서 조건에 맞는 레코드를 필터링하는 방식으로 조회되었습니다.
- 인덱스 생성 후: Bitmap Index Scan과 Bitmap Heap Scan이 사용되어 391.144 ms로 실행 시간이 단축되었습니다. 인덱스를 통해 status = 'live' 조건에 맞는 레코드만 효율적으로 검색된 것으로 확인되었습니다.

**인덱스 개선**

scheduled_time 조건을 추가해서 특정 날짜에 해당하는 레코드만 조회하도록 하면 쿼리의 대상이 되는 행 수를 줄일 수 있어서 성능이 더 향상할 수 있지 않을까라는 생각을 했습니다.

**복합인덱스 생성 전 explain**

```sql
EXPLAIN ANALYZE
SELECT *
FROM broadcast_entity
WHERE status = 'live'
  AND scheduled_time >= '2024-11-09 00:00:00'  --현재날짜
  AND scheduled_time < '2024-11-10 00:00:00';
```

```
Gather  (cost=4636.65..59700.40 rows=50 width=166) (actual time=23.855..220.618 rows=334 loops=1)
  Workers Planned: 2
  Workers Launched: 2
  ->  Parallel Bitmap Heap Scan on broadcast_entity  (cost=3636.64..58695.40 rows=21 width=166) (actual time=17.219..210.193 rows=111 loops=3)
        Recheck Cond: (status = 'live'::broadcast_entity_status_enum)
        Filter: ((scheduled_time >= '2024-11-09 00:00:00+09'::timestamp with time zone) AND (scheduled_time < '2024-11-10 00:00:00+09'::timestamp with time zone))
        Rows Removed by Filter: 110998
        Heap Blocks: exact=9259
        ->  Bitmap Index Scan on idx_broadcast_status  (cost=0.00..3636.63 rows=333361 width=0) (actual time=18.467..18.467 rows=333328 loops=1)
              Index Cond: (status = 'live'::broadcast_entity_status_enum)
Planning Time: 0.756 ms
Execution Time: 220.812 ms
```

status 열에 설정된 인덱스(idx_broadcast_status)가 사용되고 있는 상황입니다.  
이 인덱스 덕분에 status = 'live' 조건을 효율적으로 조회하고 있지만, scheduled_time 조건은 인덱스를 사용하지 않고 추가적인 필터링으로 처리되고 있는 상황입니다.

**복합인덱스 생성**

```
CREATE INDEX idx_broadcast_status_scheduled_time
ON broadcast_entity (status, scheduled_time);
```

**복합 인덱스 결과**

```
Index Scan using idx_broadcast_status_scheduled_time on broadcast_entity  (cost=0.42..193.05 rows=50 width=166) (actual time=0.368..13.683 rows=334 loops=1)
  Index Cond: ((status = 'live'::broadcast_entity_status_enum) AND (scheduled_time >= '2024-11-09 00:00:00+09'::timestamp with time zone) AND (scheduled_time < '2024-11-10 00:00:00+09'::timestamp with time zone))
Planning Time: 12.357 ms
Execution Time: 14.016 ms
```

- Execution Time: 쿼리를 실행하고 데이터를 반환하는 데 걸린 실제 시간.
- Planning Time: 실행 계획을 수립하는 데 걸린 시간.

**해석**

- 성능 개선: 복합 인덱스를 추가한 후 실행 시간이 220.812 ms에서 14.016 ms로 대폭 줄어들었습니다. 이는 쿼리가 Index Scan을 통해 조건을 만족하는 데이터를 효율적으로 검색되었습니다.
- 비용 감소: cost 값이 큰 폭으로 줄어든 것을 보면, 데이터베이스의 작업 비용도 크게 줄어들었음을 알 수 있었습니다.
- 필터링 비용 감소: 복합 인덱스 사용 전에는 조건에 맞는 데이터를 찾기 위해 추가적인 필터링이 필요했지만, 복합 인덱스 후에는 Index Scan 단계에서 조건이 바로 적용되어 추가적인 필터링이 발생하지 않았습니다.

복합 인덱스를 설정한 후 성능이 상당히 개선되었습니다.  
실행 시간과 비용이 크게 줄어들었고, 데이터베이스가 인덱스를 통해 조건을 바로 만족하는 데이터를 가져왔기 때문에 쿼리 성능이 최적화된 것을 확인할 수 있었습니다.
(또한 `예약된 방송 조회` API도 해당 인덱스를 타게되어 두개의 API가 성능 향상되는 결과를 불러 일으켰지만, 같은 내용이라 작성X)

### 한 방송의 모든 채팅 조회

**더미 생성**

```sql
-- Insert 1,000,000 dummy chats
INSERT INTO chat_entity (user_id, broadcast_id, message, created_at, updated_at)
SELECT
    (i % 1000) + 1, -- userId ranging from 1 to 1000
    (i % 100) + 1, -- broadcastId ranging from 1 to 100
    'This is a dummy message for chat number ' || i, -- message content
    now() - (i % 100) * interval '1 minute', -- created_at with variation
    now() -- updated_at as current time
FROM generate_series(1, 1000000) AS i;

```

**인덱스 생성 전**

```sql
const [chatEntities, totalCount] = await this.chatRepository
      .createQueryBuilder('chat')
      .where('chat.broadcastId = :broadcastId', { broadcastId })
      .orderBy('chat.createdAt', 'ASC')
      .skip(pagination.getSkip())
      .take(pagination.getTake())
      .getManyAndCount();
```

**결과**

```
Gather Merge  (cost=19800.32..20801.86 rows=8584 width=74) (actual time=146.485..149.196 rows=10000 loops=1)
  Workers Planned: 2
  Workers Launched: 2
  ->  Sort  (cost=18800.30..18811.03 rows=4292 width=74) (actual time=137.153..137.274 rows=3333 loops=3)
        Sort Key: created_at
        Sort Method: quicksort  Memory: 586kB
        Worker 0:  Sort Method: quicksort  Memory: 555kB
        Worker 1:  Sort Method: quicksort  Memory: 555kB
        ->  Parallel Seq Scan on chat_entity  (cost=0.00..18541.33 rows=4292 width=74) (actual time=0.206..133.864 rows=3333 loops=3)
              Filter: (broadcast_id = 100)
              Rows Removed by Filter: 330000
Planning Time: 1.322 ms
Execution Time: 149.747 ms
```

**인덱스 생성**

```
CREATE INDEX idx_chat_broadcast_created_at ON chat_entity (broadcast_id, created_at);
```

**결과**

```
Sort  (cost=13577.06..13600.48 rows=9367 width=74) (actual time=234.031..234.386 rows=10000 loops=1)
  Sort Key: created_at
  Sort Method: quicksort  Memory: 1791kB
  ->  Bitmap Heap Scan on chat_entity  (cost=109.02..12959.15 rows=9367 width=74) (actual time=6.352..231.043 rows=10000 loops=1)
        Recheck Cond: (broadcast_id = 99)
        Heap Blocks: exact=10000
        ->  Bitmap Index Scan on idx_chat_broadcast_created_at  (cost=0.00..106.68 rows=9367 width=0) (actual time=4.142..4.142 rows=10000 loops=1)
              Index Cond: (broadcast_id = 99)
Planning Time: 17.712 ms
Execution Time: 235.636 ms
```

**비교**

- 인덱스 생성 전: Parallel Seq Scan이 사용되어 테이블의 데이터를 병렬로 스캔하고 broadcast_id를 필터링한 후 created_at으로 정렬했습니다. 그래서 병렬 처리를 통해 성능이 개선되었지만, 여전히 테이블 전체 스캔에 가까운 작업을 수행한 결과를 보였고 149.747 ms의 수행시간이 소요되었습니다.
- 인덱스 생성 후: Bitmap Index Scan과 Bitmap Heap Scan이 사용되었습니다. 인덱스를 사용하여 broadcast_id를 필터링한 후, 필요한 블록을 정확히 가져왔습니다. 하지만 인덱스를 사용했지만 정렬(Sort) 작업이 여전히 존재하며, 메모리 사용량이 증가했고 235.636 ms
  의 수행시간이 소요되었습니다.
- 결론 : Bitmap Index Scan이 broadcast_id를 기반으로 데이터 필터링을 수행하여 정렬 전 데이터 수를 줄이는 데는 도움이 되었지만, 정렬 자체가 여전히 추가적인 비용을 초래했습니다.

**인덱스 수정**

```
CLUSTER chat_entity USING idx_chat_broadcast_created_at;
```

chat_entity 테이블을 broadcast_id, created_at으로 클러스터링하면, 정렬된 상태를 유지하도록 수정합니다.

**쿼리 explain 조회**

```
EXPLAIN ANALYZE
SELECT *
FROM chat_entity
WHERE broadcast_id = 99
ORDER BY created_at ASC;
```

**결과**

```
Sort  (cost=13576.50..13599.92 rows=9367 width=74) (actual time=10.844..11.801 rows=10000 loops=1)
  Sort Key: created_at
  Sort Method: quicksort  Memory: 1791kB
  ->  Bitmap Heap Scan on chat_entity  (cost=109.02..12958.59 rows=9367 width=74) (actual time=1.637..8.591 rows=10000 loops=1)
        Recheck Cond: (broadcast_id = 99)
        Heap Blocks: exact=134
        ->  Bitmap Index Scan on idx_chat_broadcast_created_at  (cost=0.00..106.68 rows=9367 width=0) (actual time=1.546..1.547 rows=10000 loops=1)
              Index Cond: (broadcast_id = 99)
Planning Time: 0.391 ms
Execution Time: 12.539 ms
```

CLUSTER 명령어를 사용한 후 EXPLAIN ANALYZE의 결과를 보면 성능이 눈에 띄게 향상된 것을 확인할 수 있었습니다.

- 기존 : Bitmap Heap Scan과 정렬 작업이 있었고, 정렬의 비용이 컸습니다(Execution Time: 235.636 ms)
- 클러스터링 인덱스 추가 : 여전히 Bitmap Heap Scan을 사용하고 ORDER BY created_at 정렬이 있지만, 정렬 작업의 비용이 많이 줄었고, 데이터가 인덱스 순서대로 정렬되어 있어 ORDER BY가 효율적으로 수행되어 Execution Time이 크게 감소했습니다.(Execution Time: 12.539 ms
  )

**결론**

CLUSTER 명령어로 테이블을 인덱스 순서대로 정렬한 후 쿼리 성능이 대폭 개선되었습니다. 이는 created_at 기준의 정렬 비용이 크게 줄었기 때문입니다.  
Execution Time이 235.636 ms에서 12.539 ms로 감소한 것은 ORDER BY 작업이 효율적으로 수행되었다는 것을 확인할 수 있습니다.  
인덱스 순서 정렬(Ordering)에 대한 인덱스는 CLUSTER를 사용해 테이블을 인덱스 순서대로 정렬하는 것으로 처리하면, 특정 쿼리에 대해 큰 성능 향상을 가져올 수 있다는 것을 알게 되었습니다.

**유의점**

```
CLUSTERING이란 테이블의 데이터를 지정된 인덱스 순서대로 물리적으로 재정렬하는 명령을 말합니다.
이것을 주기적으로 수행해야 하는 이유는 테이블이 자주 변경(삽입, 업데이트, 삭제)되면 물리적 정렬이 점차 깨지기 때문입니다.
이렇게 되면 CLUSTER의 정렬 효과가 점차 사라지고, 초기 성능 향상 효과가 줄어들기 때문에 클러스터링 인덱스로 인한 정렬된 순서 유지를 위해서는 주기적으로 인덱스 순서대로 저장되어 있게 작업을 해줘야합니다.
```
