// 마지막 활동기록
-> jwt 이용하면 로그인 한번하고 다음 로그인까지 오랜 기간이 지나므로 활동기록을 알기 힘듦
-> Nestjs 미들웨어에서 request마다 마지막 활동 체크 가능

// 유저는 1개의 방송만 broadcast가능
-> user-broadcast onetoone 관계

// Psql은 datetime이 없고 timestamptz를 제공
-> timezone을 제공해서 timeorm config에 timezone설정 안함

// Psql은 utf-8을 기본 제공
-> 근데 Database에는 명시적으로 설정함

// streaming 고려해야할 것들..
-> 트랜스코딩
-> 동시성 제한
-> 파일 저장 정책

---

## enity

프로젝트의 데이터베이스 설계는 다음과 같습니다.

![entity](asset/entity.png)

## Docs

프로젝트와 관련된 문서들입니다.

[index 설정](docs/db-index.md)
