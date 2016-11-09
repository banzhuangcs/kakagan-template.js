;(function (root, factory) {
  if (typeof module !== 'undefined' && module.exports) { // CommonJS规范
    module.exports = factory();
  } else if (root && root.self) { // 支持浏览器
    root.template = factory();
  }
})(window, function () {
  var tplExp = /<%([\s\S]*?)%>/g;
  var keywordStatementExp = /^\s*(for|if|else|switch|\?|\{|\})/;
  var match = null;

  function matchIsKeywordStatement(tplPart) {
    return keywordStatementExp.test(tplPart);
  }

  function resolveStatement (tplPart, isStatement) {
    // <% for (var i = 0, l = xx.length; i < l; i++) { %><% } %>
    // <% if (...) { %><% } %><% else if (...) { %> <% } %> <% else{ %> <% } %>
    // <% xxoo ? xx : oo %>
    // <% switch () %>
    //
    // 如果是普通的html标签或文本，只需要将出现的"转义
    if (!isStatement) {
      return 'res.push("'+ tplPart.replace(/"/g, '\\"') +'");\n';
    } else {
      if (keywordStatementExp.test(tplPart)) {
        return tplPart + ';\n';
      } else {
        return 'res.push('+ tplPart +');\n';
      }
    }

    return statement;
  }

  function updateIndex (value) {
    return value;
  }

  function template(tpl, data) {
    tpl || (tpl = '');

    var index = 0;
    var statement = 'var res = [];\n';

    while (match = tplExp.exec(tpl)) {
      // 解析<%...%>之前字符串
      statement += resolveStatement(tpl.slice(index, match.index))

      // 解析<%...%>之间的...
      statement += resolveStatement(match[1], true);

      // 更新<%...%>查找位置，结果为最新
      index = updateIndex(match.index + match[0].length);
    }

    // 添加最后一个<%...%>后的html代码
    statement += resolveStatement(tpl.substr(index, tpl.length - index));
    statement += 'return res.join("");';

    return new Function(statement).call(data);
  }

  return template;
});
