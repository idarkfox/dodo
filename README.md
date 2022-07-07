<!--
 * @Descripttion: 
 * @version: 
 * @Author: idarkfox
 * @Date: 2022-07-06 17:13:55
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-07-06 22:47:05
-->
# dodo
HTML TAG Template
## Start
(```)
<script defer type="module" src="/javascripts/traditional-import.js"></script>
<script>
    var list = [{ a: 1, b: "b1" }, { a: 2, b: "b2" }, { a: 3, b: "b3" }, { a: 4, b: "b4" }, { a: 5, b: "b5" }, { a: 6, b: "b6" }, { a: 7, b: "b7" }, { a: 8, b: "b8" }];
</script>
<html>
<body>
    <ul>
        <dodo-tpl for="(x,i)" data-in="list">
            <li><dodo-tpl data-text="x.a" ></dodo-tpl>|<dodo-tpl data-text="x.b" ></dodo-tpl></li>
        </dodo-tpl>
    </ul>
</body>
</html>
(```)