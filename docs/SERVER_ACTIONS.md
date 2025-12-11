# Server Actions 响应结构规范

为确保前后端交互的一致性和可维护性，所有 Server Actions 必须遵循统一的响应结构。

## 核心类型定义

我们在 `lib/types.ts` 中定义了泛型 `ActionResponse`：

```typescript
export type ActionResponse<T = void> = {
  success: boolean;                // 必须字段，表示操作是否成功
  message?: string;                // 可选，用于返回操作结果描述（成功提示或错误消息）
  errors?: Record<string, string[]>; // 可选，用于表单验证错误，键为字段名，值为错误信息数组
  data?: T;                        // 可选，泛型数据字段，用于返回操作结果数据
};
```

## 编写 Server Actions

所有 Server Action 函数应返回 `Promise<ActionResponse<T>>`。

### 成功响应示例

```typescript
// 无数据返回
return { 
  success: true, 
  message: '操作成功' 
};

// 带数据返回
return { 
  success: true, 
  message: '创建成功', 
  data: { id: 123, ... } 
};
```

### 失败响应示例

```typescript
// 一般错误
return { 
  success: false, 
  message: '数据库连接失败' 
};

// 表单验证错误 (Zod)
if (!parsed.success) {
  return { 
    success: false, 
    message: '输入数据无效', 
    errors: parsed.error.flatten().fieldErrors 
  };
}
```

## 前端调用规范

前端组件（如使用 `useFormState` 或直接调用）应检查 `success` 字段。

```typescript
const [state, formAction] = useFormState(serverAction, initialState);

useEffect(() => {
  if (state.message) {
    if (state.success) {
      toast.success('成功', { description: state.message });
      // 处理 data (如果需要)
    } else {
      toast.error('失败', { description: state.message });
      // 处理 errors (如高亮表单字段)
    }
  }
}, [state]);
```

### 直接调用示例

```typescript
const result = await someAction(formData);

if (!result.success) {
  toast.error("操作失败", { description: result.message });
} else {
  toast.success("操作成功", { description: result.message });
  // 使用 result.data
}
```

## 最佳实践

1. **始终检查 `success`**：不要依赖 `error` 或 `failure` 字段（旧模式已废弃）。
2. **统一错误消息**：使用 `message` 字段向用户展示友好的错误提示。
3. **详细验证错误**：使用 `errors` 字段返回具体的字段级验证错误，便于前端展示在对应输入框下方。
4. **类型安全**：在前端使用 `ActionResponse` 类型标注 `initialState`。
