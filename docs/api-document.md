# API Document

> `api/v1/`
> 
> Actual Response = `Ok<Response> | Error<ReasonType>`

## 0. Uncategorized

| Method | Api             | Response       |
| ------ | --------------- | -------------- |
| `GET`  | `user/self`     | `PersonInfo`   |
| `GET`  | `session/items` | `Session[All]` |

## 1. Person Api

| Method | Api                                     | Response          |
| ------ | --------------------------------------- | ----------------- |
| `GET`  | `friend/:id`                            | `FriendInfo`      |
| `GET`  | `friend/items`                          | `FriendInfo[All]` |
| `GET`  | `friend/:id/message/:id`                | `Message`         |
| `GET`  | `friend/:id/message/items/[:startId]`   | `Message[20]`     |
| `GET`  | `stranger/:id`                          | `StrangerInfo`    |
| `GET`  | `stranger/:id/message/:id`              | `Message`         |
| `GET`  | `stranger/:id/message/items/[:startId]` | `Message[20]`     |

| Method | Api                    | Body          | Response          |
| ------ | ---------------------- | ------------- | ----------------- |
| `POST` | `friend/:id/message`   | `MessageBody` | `MessageResponse` |
| `POST` | `stranger/:id/message` | `MessageBody` | `MessageResponse` |

## 2. Group Api

| Method | Api                                  | Response               |
| ------ | ------------------------------------ | ---------------------- |
| `GET`  | `group/:id`                          | `GroupInfo`            |
| `GET`  | `group/items`                        | `GroupInfo[All]`       |
| `GET`  | `group/:id/member/:id`               | `GroupMemberInfo`      |
| `GET`  | `group/:id/member/items`             | `GroupMemberInfo[All]` |
| `GET`  | `group/:id/message/:id`              | `Message`              |
| `GET`  | `group/:id/message/items/[:startId]` | `Message[20]`          |

| Method | Api                 | Body          | Response          |
| ------ | ------------------- | ------------- | ----------------- |
| `POST` | `group/:id/message` | `MessageBody` | `MessageResponse` |
