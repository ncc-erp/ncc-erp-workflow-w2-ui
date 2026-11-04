# W2 Mezon Bot

Bot Mezon thay thế KOMU cho W2. Viết bằng `mezon-sdk` (2.8.65), Node.js ≥ 18.

## Bot làm được gì

| Chức năng | Cách hoạt động |
|---|---|
| Nhận task từ W2 | W2 gọi `POST /sendW2TaskToUser`, bot gửi DM cho người được giao một card gồm: thông tin request theo từng loại, người tạo (Name · Email · Branch), Email assignment, thời gian tạo, form nhập liệu (`DynamicActionData`), ô Lý do, và hai nút **Approve** / **Reject** |
| Form duyệt mặc định | Nếu W2 gửi `DynamicActionData` rỗng thì bot tự dùng form có sẵn: **Probationary Confirmation** (`StrengthPoints`, `WeaknessPoints`, tên giống web/email W2), **Resignation** (`LastWorkingDay`, điền sẵn từ `DesiredLastWorkingDay`, và `Note`). Template W2 gửi kèm luôn được ưu tiên. Xem `src/workflows.ts` |
| Approve / Reject ngay trong chat | Bot điền giá trị user nhập vào template, **validate** (field bắt buộc, ngày dd/MM/yyyy), gọi W2, rồi **sửa lại card** thành kết quả và bỏ nút để không bấm lại được |
| Tin nhắn thông báo | W2 gọi `POST /sendMessageToUser`, bot gửi DM. Hiển thị `**đậm**`, khối ```` ``` ```` và link bấm được, giống KOMU |
| Tạo request bằng lệnh | `*w2request <loại>` y như KOMU (`wfh`, `device`, `changeoffice`, `officeequipment`, `probationaryconfirmation`, `help`), hoặc `*w2 <tên workflow>` cho workflow bất kỳ. Bot lấy template từ W2 và gửi form qua DM. Bấm **Gửi request** để tạo request. Bot kiểm tra ngày đúng dd/MM/yyyy, **không trước hôm nay** (trừ Probationary Confirmation) và **EndDate ≥ StartDate** |
| Liên kết tài khoản | `*w2 link` để liên kết Mezon với email W2 qua Mezon OAuth, `*w2 whoami` để xem email đang liên kết. Admin có thể import hàng loạt |

### Khác KOMU cũ ở đâu

- **Không mất dữ liệu form khi approve.** Bot luôn gửi `DynamicActionData` đúng format web đang dùng (`[{ name, type, isRequired, data, ... }]`). Nếu thiếu field bắt buộc thì bot báo lỗi và **không** approve. KOMU gửi 2 field cùng tên `StrengthPoints` với `data: extraData.note` (ô không tồn tại), nên nội dung đánh giá thử việc bị mất mà W2 vẫn báo approve thành công.
- **Không approve nhầm task.** KOMU lưu `taskId` trong một biến dùng chung cho cả bot, nên hai người thao tác xen kẽ có thể approve hoặc reject sai task. Bot mới gắn task id vào chính nút bấm và message.
- **Chỉ người được giao mới bấm được.** Có chặn double click, và gửi trùng task cho cùng một người thì bỏ qua.
- **Card được cập nhật sau khi xử lý** (Đã approve / Đã reject / Đã được xử lý trước đó). User không còn bấm vào một task đã đóng.
- **Trạng thái lưu ra file** (`DATA_DIR/store.json`). Bot restart xong, các nút trên card cũ vẫn hoạt động.
- **Trả HTTP status code đúng** (401 / 400 / 404 / 503 / 502). W2 nhờ đó ghi `W2KomuMessageLogs.Status = 0` khi gửi thất bại.
- **Có `GET /health`** để monitor.

## Cài đặt

### 1. Tạo bot trên Mezon
1. Vào https://mezon.ai/developers, chọn **New Application**, chọn **Create a bot**.
2. Lấy **Bot ID** và **token** ở mục General Information.
3. Ở mục **Installation**, mở link cài đặt và thêm bot vào clan NCC (cần quyền Manage Clan).

### 2. Chạy bot
Bot nằm trong thư mục `bot/` của repo `ncc-erp-workflow-w2-ui` nhưng là project Node **riêng**: dùng `npm` (không dùng pnpm của web), có `package.json`, `tsconfig` và test riêng. ESLint/Prettier/lint-staged của web đã bỏ qua `bot/`, và bot không được deploy cùng web (`dist/`).

```bash
cd bot
cp .env.example .env   # điền các giá trị
npm ci
npm run build
npm start
# hoặc: docker build -t w2-mezon-bot . && docker run --env-file .env -p 3000:3000 -v w2bot-data:/app/data w2-mezon-bot
```

### 3. Cấu hình W2 (appsettings)
```jsonc
"KomuConfiguration": {
  "ApiUrl": "https://<host-bot>/",      // phải có dấu / ở cuối (W2 nối thẳng "sendMessageToUser")
  "XSecretKey": "<giống INBOUND_SECRET của bot>"
},
"ApiConfiguration": {
  "XSecretKey": "<giống W2_API_KEY của bot>",
  "SecretKeyHeaderName": "x-secret-key"  // giống W2_API_KEY_HEADER
}
```
Nên **đổi** `ApiConfiguration:XSecretKey` sang key mới khi chuyển bot, để KOMU cũ không gọi được W2 nữa.

### 4. Định danh user (quan trọng)
Username Mezon **không phải lúc nào cũng trùng email** (vd: email `nguyenvana@ncc.asia` nhưng Mezon là `mezonusera123`). Vì vậy bot **không đoán email từ username**. Nó chỉ dùng **liên kết đã xác minh** `Mezon user id ↔ email W2`, lưu ở `DATA_DIR/store.json`. Không cần sửa W2.

Có hai cách tạo liên kết:

**a) User tự liên kết bằng Mezon OAuth** (`*w2 link`)
1. User gõ `*w2 link`, bot DM một link (hết hạn sau 15 phút, gắn với chính tài khoản đó).
2. User mở link và đăng nhập Mezon. Mezon trả về `user_id` và email đã xác thực.
3. Bot chỉ chấp nhận khi `user_id` khớp người nhận link và email thuộc `@EMAIL_DOMAIN`.

Cần cấu hình `MEZON_OAUTH_CLIENT_ID`, `MEZON_OAUTH_CLIENT_SECRET` và `BOT_PUBLIC_URL`, đồng thời đăng ký Redirect URI `{BOT_PUBLIC_URL}/link/callback` cho application của bot trên Mezon developer portal.

**b) Admin import hàng loạt.** Dùng để mọi người dùng được ngay từ đầu, không phải tự liên kết.

Lấy danh sách từ DB W2 production (HRM đã sync `MezonUserId`, chỉ đọc, không sửa W2):
```sql
SELECT "Email" AS email, "MezonUserId" AS "mezonUserId"
FROM "AbpUsers" WHERE coalesce("MezonUserId", '') <> '' AND "IsActive";
```
Rồi gửi vào bot:
```bash
curl -X POST "$BOT_URL/admin/import-links" -H "content-type: application/json" \
  -H "X-Secret-Key: $ADMIN_SECRET" -d '[{"email":"a.b@ncc.asia","mezonUserId":"123..."}]'
```

**Bot dùng liên kết thế nào**

| Tình huống | Bot làm gì |
|---|---|
| W2 gửi task / tin nhắn (`username` = phần trước @ của email) | Tìm Mezon id theo liên kết đã xác minh. Không có thì trả **404** (W2 ghi log lỗi), **không gửi bừa** cho người có username Mezon trùng |
| User gõ `*w2 <workflow>` | Dùng email đã liên kết. Chưa liên kết thì hướng dẫn `*w2 link` |
| User bấm Approve/Reject | Dùng email người được giao task (W2 gửi). Chỉ đúng người nhận card mới bấm được |
| `*w2 whoami` | Cho user xem email đang liên kết |

`TRUST_MEZON_USERNAME_AS_EMAIL=true` bật lại cách đoán của KOMU cũ. **Không khuyến nghị**: sai với username tự đặt và có thể nhận nhầm người. Chỉ nên dùng tạm trong lúc chưa import xong.

## Các API W2 bot gọi
Tất cả là `POST {W2_API_BASE_URL}/api/app/mezon/...`, header `{W2_API_KEY_HEADER}: {W2_API_KEY}`:

| Route | W2 method |
|---|---|
| `list-property-definitions-by-command` | `ListPropertyDefinitionsByCommand` |
| `new-instance` | `CreateNewInstanceAsync` |
| `approve-w2task` | `ApproveW2TaskAsync` |
| `reject-w2task` | `RejectW2TaskAsync` |

Đã đối chiếu với `/api/abp/api-definition` của W2.

## Kiểm tra lần đầu (bắt buộc)
Tài liệu Mezon **chưa mô tả** cấu trúc `extra_data` khi bấm nút (giá trị các ô input). Bot đọc nó theo dạng `{ "<inputId>": value }`, chấp nhận cả key có hậu tố `-component`.
1. Chạy bot với `LOG_LEVEL=debug`.
2. Gửi thử một task có form và bấm Approve.
3. Xem log `Button event` để xác nhận `extra_data` có chứa giá trị đã nhập.
4. Vào web W2 kiểm tra nội dung đánh giá đã hiển thị.

## Phát triển
```bash
npm run dev        # chạy với tsx watch
npm test           # test logic form / DynamicActionData
npm run typecheck
```

Cấu trúc code:
- `src/bot.ts`: kết nối Mezon, xử lý lệnh, bấm nút, gửi DM.
- `src/httpServer.ts`: API tương thích KOMU cho W2 gọi.
- `src/w2Client.ts`: gọi API của W2.
- `src/forms.ts`: logic form thuần (có test).
- `src/cards.ts`: dựng embed và nút.
- `src/store.ts`: lưu trạng thái ra file JSON.
