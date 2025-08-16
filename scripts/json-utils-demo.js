/**
 * JSON工具类使用示例
 * 展示如何处理服务器返回的可能有格式错误的JSON数据
 */

// 确保文档加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
  // 示例1: 处理格式正确的JSON
  const validJson = '{"name": "蘑菇", "age": 18, "hobbies": ["编程", "画画", "听音乐"]}';
  console.log('示例1: 格式正确的JSON');
  const result1 = JsonUtils.safeParse(validJson);
  console.log('解析结果:', result1);
  console.log('----------------------------');

  // 示例2: 处理格式错误的JSON (缺少逗号)
  const invalidJson1 = '{"name": "蘑菇" "age": 18 "hobbies": ["编程", "画画", "听音乐"]}';
  console.log('示例2: 缺少逗号的JSON');
  console.log('原始数据:', invalidJson1);
  const result2 = JsonUtils.safeParse(invalidJson1);
  console.log('修复并解析结果:', result2);
  console.log('----------------------------');

  // 示例3: 处理格式错误的JSON (单引号)
  const invalidJson2 = "{'name': '蘑菇', 'age': 18, 'hobbies': ['编程', '画画', '听音乐']}";
  console.log('示例3: 单引号的JSON');
  console.log('原始数据:', invalidJson2);
  const result3 = JsonUtils.safeParse(invalidJson2);
  console.log('修复并解析结果:', result3);
  console.log('----------------------------');

  // 示例4: 处理格式错误的JSON (未转义的引号)
  const invalidJson3 = '{"name": "蘑菇"s blog", "age": 18}';
  console.log('示例4: 未转义引号的JSON');
  console.log('原始数据:', invalidJson3);
  const result4 = JsonUtils.safeParse(invalidJson3);
  console.log('修复并解析结果:', result4);
  console.log('----------------------------');

  // 示例5: 处理不完整的JSON
  const invalidJson4 = '"name": "蘑菇", "age": 18';
  console.log('示例5: 不完整的JSON');
  console.log('原始数据:', invalidJson4);
  const result5 = JsonUtils.safeParse(invalidJson4);
  console.log('修复并解析结果:', result5);
  console.log('----------------------------');

  // 示例6: 模拟服务器响应处理
  function simulateServerResponse() {
    // 模拟服务器返回的可能有问题的响应
    const responses = [
      // 格式正确的JSON
      '{"status": "success", "data": {"message": "操作成功"}}',
      // 格式错误的JSON (缺少逗号)
      '{"status": "error" "code": 500 "message": "服务器错误"}',
      // 格式错误的JSON (单引号)
      "{'status': 'warning', 'message': '数据不完整'}",
      // 非JSON字符串
      "操作失败: 数据库连接错误"
    ];

    // 随机选择一个响应
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    console.log('示例6: 模拟服务器响应');
    console.log('服务器响应:', randomResponse);

    // 使用工具类处理响应
    const result = JsonUtils.processResponse(randomResponse, {
      onError: function(error) {
        console.error('处理响应时出错:', error);
        // 可以在这里添加错误处理逻辑
      },
      defaultValue: {status: 'error', message: '无法解析服务器响应'}
    });

    console.log('处理后的响应:', result);
    return result;
  }

  // 执行模拟服务器响应处理
  const serverResult = simulateServerResponse();
  console.log('----------------------------');

  // 示例7: 在实际AJAX请求中使用
  function fetchData(url) {
    console.log('示例7: 实际AJAX请求中使用');
    // 模拟fetch请求
    return new Promise((resolve, reject) => {
      // 模拟网络延迟
      setTimeout(() => {
        // 模拟服务器返回的可能有格式错误的响应
        const response = '{"status": "success", "data": {"items": [1, 2, 3, 4, 5]}}';
        console.log('服务器返回:', response);

        // 使用工具类处理响应
        const processedData = JsonUtils.processResponse(response);
        resolve(processedData);
      }, 1000);
    });
  }

  // 调用fetchData
  fetchData('/api/data')
    .then(data => {
      console.log('处理后的数据:', data);
    })
    .catch(error => {
      console.error('请求失败:', error);
    });
});

// 添加到全局，方便在控制台测试
window.runJsonUtilsDemo = function() {
  document.dispatchEvent(new Event('DOMContentLoaded'));
}