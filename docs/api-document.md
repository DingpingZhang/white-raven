# API Document

- Prefix: `api/v1/`

- You can find types mentioned below in [basic-types.ts](../src/api/basic-types.ts) and [http-types.ts](../src/api/http-types.ts)

- Actual Response = `Ok<Response> | Err<ReasonType>`

## 0. Uncategorized Api

| Method | Api        | Response       |
| ------ | ---------- | -------------- |
| `GET`  | `user`     | `PersonInfo`   |
| `GET`  | `sessions` | `Session[All]` |

## 1. Person Api

| Method | Api                                    | Response          |
| ------ | -------------------------------------- | ----------------- |
| `GET`  | `friends/:id`                          | `FriendInfo`      |
| `GET`  | `friends`                              | `FriendInfo[All]` |
| `GET`  | `friends/:id/messages/:id`             | `Message`         |
| `GET`  | `friends/:id/messages[?startId=:id]`   | `Message[20]`     |
| `GET`  | `strangers/:id`                        | `StrangerInfo`    |
| `GET`  | `strangers/:id/messages/:id`           | `Message`         |
| `GET`  | `strangers/:id/messages[?startId=:id]` | `Message[20]`     |

| Method | Api                               | Body                  | Response          |
| ------ | --------------------------------- | --------------------- | ----------------- |
| `POST` | `friends/:id/messages`            | `MessageBody`         | `MessageResponse` |
| `POST` | `strangers/:id/messages`          | `MessageBody`         | `MessageResponse` |
| `POST` | `strangers/:id/messages/readedId` | `ReadedMessageIdBody` | `<Empty>: 200`    |
| `POST` | `strangers/:id/messages/readedId` | `ReadedMessageIdBody` | `<Empty>: 200`    |

## 2. Group Api

| Method | Api                                 | Response               |
| ------ | ----------------------------------- | ---------------------- |
| `GET`  | `groups/:id`                        | `GroupInfo`            |
| `GET`  | `groups`                            | `GroupInfo[All]`       |
| `GET`  | `groups/:id/members/:id`            | `GroupMemberInfo`      |
| `GET`  | `groups/:id/members`                | `GroupMemberInfo[All]` |
| `GET`  | `groups/:id/messages/:id`           | `Message`              |
| `GET`  | `groups/:id/messages[?startId=:id]` | `Message[20]`          |

| Method | Api                            | Body                  | Response          |
| ------ | ------------------------------ | --------------------- | ----------------- |
| `POST` | `groups/:id/messages`          | `MessageBody`         | `MessageResponse` |
| `POST` | `groups/:id/messages/readedId` | `ReadedMessageIdBody` | `<Empty>: 200`    |

## 3. Authentication

| Method | Api        | Body           | Response        |
| ------ | ---------- | -------------- | --------------- |
| `POST` | `login`    | `LoginBody`    | `LoginResponse` |
| `POST` | `register` | `RegisterBody` | `<Empty>: 200`  |
