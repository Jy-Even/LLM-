# 数据库表结构文档 (SQLite)

本系统采用 SQLite 作为本地轻量化存储方案，用于持久化知识库内容、搜索历史、系统配置及用户交互数据。

## 1. 知识库模块 (Knowledge Base)

### 表名: `wiki_pages`
存储所有归档的 Wiki 页面内容。

| 字段名 | 类型 | 约束 | 说明 |
| :--- | :--- | :--- | :--- |
| `id` | TEXT | PRIMARY KEY | 唯一标识符 (UUID) |
| `title` | TEXT | NOT NULL | 页面标题 |
| `content` | TEXT | NOT NULL | Markdown 或 HTML 格式的正文内容 |
| `snippet` | TEXT | | 内容摘要，用于搜索预览 |
| `source` | TEXT | | 原始来源 (文件路径、URL 等) |
| `type` | TEXT | | 文件类型 (pdf, docx, web, wiki) |
| `relevance` | INTEGER | | 语义相关度评分 (0-100) |
| `author_id` | TEXT | | 创建者 ID |
| `created_at` | DATETIME | DEFAULT CURRENT_TIMESTAMP | 创建时间 |
| `updated_at` | DATETIME | DEFAULT CURRENT_TIMESTAMP | 最后更新时间 |

### 表名: `tags`
存储所有知识标签。

| 字段名 | 类型 | 约束 | 说明 |
| :--- | :--- | :--- | :--- |
| `id` | INTEGER | PRIMARY KEY AUTOINCREMENT | 标签 ID |
| `name` | TEXT | UNIQUE NOT NULL | 标签名称 |

### 表名: `page_tags`
Wiki 页面与标签的多对多关联表。

| 字段名 | 类型 | 约束 | 说明 |
| :--- | :--- | :--- | :--- |
| `page_id` | TEXT | FOREIGN KEY | 关联 `wiki_pages.id` |
| `tag_id` | INTEGER | FOREIGN KEY | 关联 `tags.id` |

---

## 2. 交互与搜索模块 (Interaction & Search)

### 表名: `search_history`
记录用户的搜索查询，用于生成“热门趋势”。

| 字段名 | 类型 | 约束 | 说明 |
| :--- | :--- | :--- | :--- |
| `id` | INTEGER | PRIMARY KEY AUTOINCREMENT | 记录 ID |
| `query` | TEXT | NOT NULL | 搜索关键词 |
| `user_id` | TEXT | | 用户 ID |
| `created_at` | DATETIME | DEFAULT CURRENT_TIMESTAMP | 搜索时间 |

### 表名: `chat_history`
存储智能问答的对话记录。

| 字段名 | 类型 | 约束 | 说明 |
| :--- | :--- | :--- | :--- |
| `id` | INTEGER | PRIMARY KEY AUTOINCREMENT | 记录 ID |
| `session_id` | TEXT | | 会话 ID |
| `role` | TEXT | CHECK(`role` IN ('user', 'assistant')) | 发送者角色 |
| `content` | TEXT | NOT NULL | 消息内容 |
| `created_at` | DATETIME | DEFAULT CURRENT_TIMESTAMP | 时间戳 |

---

## 3. 基础与配置模块 (Core & Config)

### 表名: `users`
用户信息表。

| 字段名 | 类型 | 约束 | 说明 |
| :--- | :--- | :--- | :--- |
| `id` | TEXT | PRIMARY KEY | 唯一 ID |
| `email` | TEXT | UNIQUE | 邮箱 |
| `name` | TEXT | | 姓名 |
| `role` | TEXT | | 权限角色 (admin, user) |
| `created_at` | DATETIME | DEFAULT CURRENT_TIMESTAMP | 注册时间 |

---

## 索引优化声明
- 对 `wiki_pages.title` 创建 FTS5 全文索引。
- 对 `chat_history.session_id` 创建索引以加速会话检索。
- 对 `search_history.query` 创建索引用于趋势统计。
