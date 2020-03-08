# Webpack脚手架

学习以来，对Webpack有所理解。对于前端开发来说，他在开发过程中需要关注`js`、`css`、`assets`等相关资源。这些内容分别分散在各个目录下。`Webpack`把他们统一视作资源，在开发过程中通过`import`或者其他形式关联起来，并进行加工处理。可以减少前端开发的精力。

下面就对环境的搭建逐一拆解。

## 初始化空项目

基础环境的构建依赖Nodejs。我们通过npm来构建一个项目。

```bash
mkdir my-project && cd my-project
npm init -y
```

通过`npm init -y`来简单的创建一个`package.json`。需要简单修改一下其中的内容：

```
"private": true,
-- 删除 "main": "index.js"
```

`private`为私有项目，不至于后续误操作上传到npm网站。

这是个web前端项目，所以入口程序不必提供。

## 初始化Webpack环境

```shell
npm install -D webpack webpack-cli
```

> 💡关于`npm install`参数
>
> npm install -D 等同于 `--save-dev`
> npm install -S 等同于 `—save`
> npm install -O 等同于 `--save-optional`
> 当你为你的模块安装一个依赖模块时，正常情况下你得先安装他们
>
> （在模块根目录下npm install module-name），
>
> 然后连同版本号手动将他们添加到模块配置文件package.json中的依赖里（dependencies）。
>
> `--save`和`--save-dev`可以省掉你手动修改package.json文件的步骤。
> spm install module-name -save 自动把模块和版本号添加到`dependencies`部分
> spm install module-name -save-dve 自动把模块和版本号添加到`devdependencies`部分
>
> 至于配置文件区分这俩部分， 是用于区别开发依赖模块和产品依赖模块， 以我见过的情况来看 devDepandencies主要是配置测试框架， 例如jshint、mocha。
>
> 通过这些命令，我们会得到一个新的`package.json`。然后再做一个试验就懂得了区别：
>
> 删除node_modules目录，然后执行 
> npm install --production，可以看到，npm只帮我们自动安装package.json中dependencies部分的模块；如果执行npm install ，则package.json中指定的dependencies和devDependencies都会被自动安装进来。

可以上官方网站查看具体使用说明：https://webpack.docschina.org/guides/installation/

<!-- more -->

### 默认使用Webpack

默认无配置是可以work的，基础目录结构如下：

```
~/my-project
\- package.json
\- index.html
\- src\
		\- index.js
```

执行编译，它默认查找`src/index.js`文件，并编译到`dist/main.js`

```shell
npx webpack
```

```
~/my-project
\- package.json
\- index.html
\- src\
		\- index.js
\- dist\
		\- main.js
```

一个项目肯定需要比较多的配置，比如运用了比较新的JS语法，比如使用了import css方式组织模块等等。默认的编译方式无法满足全部需求。[^4W字长文带你深度解锁Webpack系列(上)]

### 转译现代化的JS语法

现代化的语法诸如使用了Class语法糖，想要兼容各个浏览器，需要用现代化的语法转译器，把他们变成低版本兼容语法。将JS代码向低版本转换，我们需要使用 `babel-loader`。

> loader: Webpack模块转换器，用于把模块原内容按照需求转换成新内容

```bash
npm install -D babel-loader
```

此外，我们还需要配置 `babel`，为此我们安装一下以下依赖:

```bash
# 编译插件
npm install -D @babel/core @babel/preset-env 
npm install -D @babel/plugin-transform-runtime
npm install -D @babel/plugin-proposal-class-properties
# 运行时依赖
npm install -S @babel/runtime @babel/runtime-corejs3
```

创建`.babelrc`

```json
{
  "presets": ["@babel/preset-env"],
  "plugins": [
    "@babel/plugin-proposal-class-properties",
    [
      "@babel/plugin-transform-runtime",
      {
        "corejs": 3
      }
    ]
  ]
}

```

### 转化CSS

相关文档 [^style-loader和css-loader]

```bash
npm install -D style-loader css-loader postcss-loader
```

> Webpack不仅有打包功能，还能对项目中各种文件按照我们的需求进行处理，这就用到了loader，所谓loader就是集成到Webpack的文件处理方法，这些loader在Webpack打包过程中，可以对指定类型的文件进行相应的处理，比如把less语法转换成浏览器可以识别的css语法，引入特定类型的文件（html）等等。

Webpack可以把以指定入口的一系列相互依赖的模块打包成一个文件，这里的模块指的不只是js，也可以是css。也就是说，当你用CommonJs规范去引用css文件时，webpack会把你引用的css文件也打包到最终的生成文件中里。这样我们如何让样式生效呢？有两种方法：一种是，在引入css时，在最后生成的js文件中进行处理，动态创建style标签，塞到head标签里。这样，html页面引用这个js文件时，就可以让样式生效了。另一种方法是，打包时把css文件拆出来，css相关模块最终打包到一个指定的css文件中，我们手动用link标签去引入这个css文件就可以了。这两种方法都需要配置响应的loader。

现在我们目录在src下增加`assets/css/index.css`

```
~/my-project
\- package.json
\- index.html
\- src\
		\- assets
				\- css
						\- index.css
		\- index.js
\- dist\
		\- main.js
```

#### index.css[^CSS 自定义属性：基础篇]

下面`--fontSize` 这种以`—`开头的就是自定义属性。`:root` 是CSS伪类，代表CSS根。

```css
:root {
  --fontSize: 1rem;
  --mainColor: #10569c;
  --grey: #c3c3c3;
  --highlightColor: hwb(190, 35%, 20%);
}

body {
  color: var(--mainColor);

  font-size: var(--fontSize);
  line-height: calc(var(--fontSize) * 1.5);
  padding: calc((var(--fontSize) / 2) + 1px);
}

h1,
p {
  display: flex;
}

.next {
	color: var(--grey);
}
```

#### 引入点

以下是示例代码`index.js`，`index.js`是整个编译的入口。通过`import css`把之前定义的css引入。并在下面使用。

通过`style-loader`和`css-loader`的作用，在Webpack编译期间，把css放入到页面header的`<style>`标签里。

```js
import Shit from './Shit.js'
import './assets/css/index.css'

let s = new Shit()

let rootEl = document.getElementById('app');
let p = document.createElement('P');
p.innerText = 'Hello World ' + s.name;
p.className = 'next';
// p.setAttribute('class', 'next')
console.log(s.getName())
rootEl.appendChild(p);
```

#### Webpack中的设置

```js
module.exports = {
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            }
        ]
    }
}
```

> 那么，`css-loader`和`style-loader`是干什么用的呢？
>
> 引用《入门webpack》中的原文：**`css-loader`使你能够使用类似@import和url（…）的方法实现require的功能，`style-loader`将所有的计算后的样式加入页面中，二者组合在一起使你能够把样式表嵌入webpack打包后的js文件中。**
>
> 因此，我们这样配置后，遇到后缀为.css的文件，`webpack`先用`css-loader`加载器去解析这个文件，遇到“`@import`”“`url`”等语句就将相应样式文件引入（所以如果没有`css-loader`，就没法解析这类语句），最后计算完的css，将会使用`style-loader`生成一个内容为最终解析完的css代码的style标签，放到head标签里。
> **需要注意的是，loader是有顺序的，webpack肯定是先将所有css模块依赖解析完得到计算结果再创建style标签。因此应该把`style-loader`放在`css-loader`的前面（webpack loader的执行顺序是从右到左）。**

当然它们还可以设置插入点。这里就不展开了。

#### postcss

> PostCSS 是一套利用JS插件实现的用来改变CSS的工具.这些插件能够支持变量和混合语法，转换未来CSS语法，内联图片，还有更多。
>
> 我们用过`Less`、`SASS`等工具来对CSS做`预处理`操作，按照它们约定的语法来书写并且最终转换成可用的样式，这付出的代价是**必须先熟悉这个工具的书写语法**。
>
> 随着近几年 [Grunt](http://gruntjs.cn/)、[Gulp](http://gulpjs.com/)、[Webpack](http://webpack.github.io/docs/) 等自动化工具的兴起，`组合式应用`变得非常的热门，那`PostCSS`存在的意义是什么呢？答案是：**CSS生态系统**
>
> `PostCSS`拥有非常多的插件，诸如自动为CSS添加浏览器前缀的插件`autoprefixer`、当前移动端最常用的`px`转`rem`插件`px2rem`，还有支持尚未成为CSS标准但特定可用的插件`cssnext`，还有很多很多。就连著名的`Bootstrap`在下一个版本`Bootstrap 5`也将使用`PostCSS`作为样式的基础。
>
> 一句话来概括PostCSS：**CSS编译器能够做到的事情，它也可以做到，而且能够做得更好**

💡🌶️🌶️ **设置postcss配置文件**🌶️🌶️ `postcss.config.js`

```js
module.exports = {
  plugins: [require("precss"), require("autoprefixer")]
};
```

`postcss.config.js`需要放在css同目录下。

```
~/my-project
\- package.json
\- index.html
\- src\
		\- assets
				\- css
						\- index.css
						\- postcss.config.js
		\- index.js
\- dist\
		\- main.js
```

💡🌶️🌶️**下载安装依赖插件**🌶️🌶️

```bash
npm install -D precss autoprefixer
```

💡🌶️🌶️**配置autoprefixer**🌶️🌶️

配置它的意义在于兼容各个浏览器版本。[^优化auto-prefixer配置，让CSS适配不同浏览器]

关键在于设置需要处理的浏览器版本范围。[^Browserslist]

在项目根目录下创建`.browserslistrc`

```
# browserslistrc syntax: https://github.com/browserslist/browserslist
iOS >= 8
Firefox >= 20
Android > 4.4
```

这样就能在通过Webpack编译后得到如下的css，如`-webkit-flex`和`-ms-flexbox`等。

```css
body{
  display:-webkit-flex;
  display:-ms-flexbox;
  display:-webkit-box;
  display:flex;
}

body {
color:#123456;
color:rgba(18, 52, 86, 0.47059);

font-size:16px;
font-size:1rem;
line-height:24px;
line-height:1.5rem;
padding:calc(0.5rem + 1px);
}
```

🌶️🌶️**precss的作用**🌶️🌶️ [^PreCSS 语法说明]

> PreCSS是PostCSS的一种插件，用来进行CSS预编译
>
> - PreCSS中的嵌套可以使用 `&` 符，把父选择器复制到子选择器中
> - PreCSS使用 `$` 符声明变量，比如 `$color: #ccc`
> - PreCSS中用 `@if` 和 `@else` 来控制循环
> - PreCSS中用 `@define-mixin mixin_name $arg1,$arg2{...}` 语法来声明混合宏
> - PreCSS中用 `@mixin mixin_name pass_arg1, pass_arg2;` 语法来调用混合宏
> - PreCSS中用 `@mixin-content` 保留传递内容
> - PreCSS中使用 `@define-extend extend_name{...}` 来声明可扩展的代码块
> - PreCSS中使用 `@extend extend_name` 语法来调用声明的代码扩展块
> - PreCSS可以使用 `@import` 中导入CSS文件

#### 将CSS资源单独导出

官方推荐的插件。

```bash
npm install -D mini-css-extract-plugin
```

```js
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
module.exports = {
  plugins: [
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: "[name].css",
      chunkFilename: "[id].css"
    })
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              // you can specify a publicPath here
              // by default it use publicPath in webpackOptions.output
              publicPath: '../'
            }
          },
          "css-loader"
        ]
      }
    ]
  }
}
```

优化css大小

```bash
npm install -D optimize-css-assets-webpack-plugin
```

```bash
const optimization = {
	minimizer: [
		new OptimizeCSSAssetsPlugin({})
	]
}

const settings = {
  mode: devMode ? "development" : "production",
  entry,
  output,
  module: { rules },
  plugins,
  optimization,
  devtool
};
```

#### 压缩JS

```
npm install terser-webpack-plugin --save-dev
```

```
const optimization = {
	minimizer: [
		new TerserPlugin(),
		new OptimizeCSSAssetsPlugin({})
	]
}
```

它会在 mode === ‘production’ 时，压缩JS

### Webpack.config.js

```js
"use strict";

let path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const webpack = require("webpack");
const TerserPlugin = require('terser-webpack-plugin');
const devMode = process.env.NODE_ENV !== 'production';
const config = require("./config")[devMode ? "devProps" : "prdProps"];

const entry = {
  index: "./index.js"
};

const output = {
  filename: devMode ? "js/[name].js" : "js/[name].[hash].js",
  path: path.resolve(__dirname, "../dist")
};

const devtool = devMode ? "none" : "cheap-module-eval-source-map";

const rules = [
  {
    test: /\.js$/,
    loader: "babel-loader",
    exclude: /node_modules/
  },
  {
    test: /\.css$/,
    exclude: /node_modules/,
    use: [
      { loader: devMode ? "style-loader" : MiniCssExtractPlugin.loader },
      { loader: "css-loader", options: { importLoaders: 1 } },
      { loader: "postcss-loader" }
    ]
  }
];

const plugins = [
  new HtmlWebpackPlugin({
    template: "build/index.html",
	filename: "index.html",
	/* 将环境相关的配置独立在外部 */
    ...config
  }),
  new MiniCssExtractPlugin({
	// Options similar to the same options in webpackOptions.output
	// both options are optional
	filename: devMode ? "css/[name].css" : "css/[name].[hash].css",
	chunkFilename: devMode ? "css/[id].css" : "css/[id].[hash].css"
  }),
  new webpack.SourceMapDevToolPlugin({
	  filename: "[name].js.map",
	  exclude: ["vendor.js"]
  })
];

const optimization = {
	minimizer: [
		new TerserPlugin(),
		new OptimizeCSSAssetsPlugin({})
	]
}

const settings = {
  mode: devMode ? "development" : "production",
  entry,
  output,
  module: { rules },
  plugins,
  optimization,
  devtool
};

module.exports = settings;
```



## 参考

[^4W字长文带你深度解锁Webpack系列(上)]: https://mp.weixin.qq.com/s/OBUcxEFXKQQubP08LO2Uhg
[^CSS 自定义属性：基础篇]: https://zhuanlan.zhihu.com/p/25714131
[^style-loader和css-loader]: http://www.weqianduan.com/2018/09/26/style-loader-and-css-loader/

[^优化auto-prefixer配置，让CSS适配不同浏览器]: https://segmentfault.com/a/1190000008030425
[^Browserslist]: https://github.com/browserslist/browserslist
[^PreCSS 语法说明]: https://www.jianshu.com/p/9de7f190f408