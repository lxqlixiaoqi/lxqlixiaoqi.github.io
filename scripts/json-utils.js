/**
 * JSON处理工具类
 * 提供健壮的JSON解析和错误处理功能
 */
class JsonUtils {
  /**
   * 安全解析JSON字符串
   * @param {string} jsonString - 要解析的JSON字符串
   * @param {Object} options - 配置选项
   * @param {boolean} options.tryFix - 是否尝试修复格式错误的JSON
   * @param {any} options.defaultValue - 解析失败时返回的默认值
   * @param {Function} options.onError - 解析失败时的回调函数
   * @returns {any} 解析后的JSON对象或默认值
   */
  static safeParse(jsonString, options = {}) {
    const { tryFix = true, defaultValue = null, onError = null } = options;

    try {
      // 尝试直接解析
      return JSON.parse(jsonString);
    } catch (error) {
      // 如果开启了修复尝试
      if (tryFix) {
        try {
          // 尝试修复常见问题
          const fixedJson = this.fixJson(jsonString);
          return JSON.parse(fixedJson);
        } catch (fixError) {
          // 修复失败
          if (onError) {
            onError(fixError);
          }
          return defaultValue;
        }
      }

      // 未开启修复或修复失败
      if (onError) {
        onError(error);
      }
      return defaultValue;
    }
  }

  /**
   * 尝试修复格式错误的JSON
   * @param {string} jsonString - 格式错误的JSON字符串
   * @returns {string} 尝试修复后的JSON字符串
   */
  static fixJson(jsonString) {
    // 移除前后空白
    let fixed = jsonString.trim();

    // 确保JSON以{或[开头和结尾
    if (!fixed.startsWith('{') && !fixed.startsWith('[')) {
      // 尝试判断是对象还是数组
      if (fixed.includes(':')) {
        fixed = '{' + fixed + '}';
      } else {
        fixed = '[' + fixed + ']';
      }
    }

    // 尝试修复单引号问题
    fixed = fixed.replace(/'/g, '"');

    // 尝试修复未转义的双引号
    // 注意：这是一个复杂的问题，下面的修复方法可能不适用于所有情况
    try {
      // 首先找到所有转义的引号
      const escapePositions = [];
      for (let i = 0; i < fixed.length; i++) {
        if (fixed[i] === '\\' && i + 1 < fixed.length && fixed[i + 1] === '"') {
          escapePositions.push(i);
          i++;
        }
      }

      // 然后查找未转义的引号并转义它们
      let result = '';
      let inString = false;
      let lastChar = '';

      for (let i = 0; i < fixed.length; i++) {
        const currentChar = fixed[i];

        // 检查是否是转义的引号
        const isEscapedQuote = i > 0 && fixed[i - 1] === '\\' && currentChar === '"';

        // 检查是否是字符串开始/结束
        if (currentChar === '"' && !isEscapedQuote) {
          inString = !inString;
        }

        // 如果在字符串中且遇到未转义的引号
        if (inString && currentChar === '"' && !isEscapedQuote && lastChar !== '\\') {
          result += '\\"';
        } else {
          result += currentChar;
        }

        lastChar = currentChar;
      }

      fixed = result;
    } catch (e) {
      // 如果修复失败，保持原样
      console.error('修复未转义引号失败:', e);
    }

    // 尝试修复缺少逗号的问题
    // 注意：这是一个启发式方法，可能不总是正确
    try {
      // 匹配 "key": value"pattern" 并添加逗号
      fixed = fixed.replace(/"\s*:\s*([^,\}\]]+)\s*"(?=\s*\w)/g, '": $1",');
    } catch (e) {
      console.error('修复缺少逗号失败:', e);
    }

    // 尝试修复末尾多余的逗号
    try {
      fixed = fixed.replace(/,\s*(\}|\])/g, '$1');
    } catch (e) {
      console.error('修复末尾多余逗号失败:', e);
    }

    return fixed;
  }

  /**
   * 处理服务器响应
   * @param {string|Object} response - 服务器响应
   * @param {Object} options - 配置选项
   * @returns {any} 处理后的响应数据
   */
  static processResponse(response, options = {}) {
    if (!response) {
      return options.defaultValue || null;
    }

    // 如果已经是对象，直接返回
    if (typeof response === 'object') {
      return response;
    }

    // 如果是字符串，尝试解析
    return this.safeParse(response, options);
  }
}

// 导出工具类
if (typeof module !== 'undefined' && module.exports) {
  module.exports = JsonUtils;
} else if (typeof window !== 'undefined') {
  window.JsonUtils = JsonUtils;
}