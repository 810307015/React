# react相关

## 基础知识

### 使用

* 使用`cdn`加速的方式在`html`页面中引用`react`、`react-dom`、`babel`的远程文件，在`type`类型为`text/babel`的script标签中写`react`代码。
* 使用`npx create-react-app new-app`直接生成一个空的`react`项目。

### 元素渲染

* 使用`ReactDOM.render(ele, root)`来将`elements`渲染到`root`的标签中。
* 对于子组件，可以有以下方法来编写：
  1. 一种是直接定义一个`function`，`return`一段`html`片段。
  2. 另一种是使用`es6`的`extends`关键字继承`React.Component`，重写其`render`方法。
* 示例：

```JSX
// 注意两种方法的props的用法
// 方法一
function Clock(props, context, updater) {
  return (
    <div>
      <h1>Hello World</h1>,
      <h2>现在的时间 { props.date.toLocaleTimeString() }</h2>
    </div>
  )
}
// 方法二
class Clock extends React.Component {
  render() {
    return (
      <div>
        <h1>Hello World</h1>,
        <h2>现在的时间 { this.props.date.toLocaleTimeString() }</h2>
      </div>
    )
  }
}
// 元素渲染
const ele = <Clock date={ new Date() } />
const root = document.getElementById('root')
ReactDOM.render(ele, root)
// jsx语法
// 在{}中可以执行JavaScript的表达式，如果执行的是一个数组，就会自动遍历整个数组然后循环显示
// {/* 注释... */}
```

### 状态---state

* `React` 把组件看成是一个状态机（`State Machines`）。通过与用户的交互，实现不同状态，然后渲染 `UI`，让用户界面和数据保持一致。`React` 里，只需更新组件的 `state`，然后根据新的 `state` 重新渲染用户界面（不要操作 `DOM`）。
* state的特点
  1. 数据自顶向下流动，单向数据流。
  2. 父组件或子组件都不能知道某个组件是有状态还是无状态，并且它们不应该关心某组件是被定义为一个函数还是一个类。
  3. 组件可以选择将其状态作为属性传递给其子组件。
* state的使用注意事项
  1. 构造函数是唯一能够初始化this.state的地方
  2. 改变state的值，不能用点的方式来改变，应该使用setState(obj)方法进行修改。
  3. this.props 和 this.state 可能是异步更新的，需要使用setState((prevState, props) => { counter: prevState.counter + props.incream })。第一个参数为先前的状态，此次更新应用的props作为第二个参数。
* 代码示例：

```JSX
class Clock extends React.Component {
  constructor(props) {
    super(props)
    this.state = { date: new Date() }
  }

  // 生命周期钩子，在render()方法調用之后执行
  componentDidMount() {
    this.timerID = setInterval(
      () => this.tick(),
      1000
    );
  }

  // 生命周期钩子，组件卸载之后调用
  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  // 自定义的改变state的方法
  tick() {
    this.setState({
      date: new Date()
    });
  }

  render() {
    return (
      <div>
        <h1>Hello World</h1>,
        <h2>现在的时间 { this.state.date.toLocaleTimeString() }</h2>
      </div>
    )
  }
}
```

### props

* state 和 props 主要的区别在于 props 是不可变的，而 state 可以根据与用户交互来改变。这就是为什么有些容器组件需要定义 state 来更新和修改数据。 而子组件只能通过 props 来传递数据。
* props可以接收来自任何的输入，而不用去考虑它是来自父组件的state还是属性绑定还是直接输入的值。
* 父组件向子组件通信，绑定属性就可以了。
* 子组件向父组件通信，将父组件的setState方法封装进回调函数传递给子组件，记住其中的this指向。
* 代码示例：

```JSX
// 使用props实现父子组件的通信
class Parent extends React.Component {
  constructor() {
    super()
    this.state = { id: 1 }
  }

  changeId = (id) => {
    this.setState({
      id
    })
  }

  render() {
    return (
      <div>
        <div>状态中的id为: {this.state.id}</div>
        <Child id={ id } callback={this.callback} />
      </div>
    )
  }
}

class Child extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      id: props.id
    }
  }
  change = () => {
    this.props.callback(this.state.id)
  }
  render() {
    return (
      <h1 onClick={this.change}>id为 {this.props.id}</h1>
    )
  }
}
```

### 事件处理

* 事件绑定属性的命名采用驼峰命名法。
* 绑定事件和绑定属性类似，采用`{ funName }`的方法将调用的方法名赋值。
* 在ES6中的事件绑定需要使用bind绑定this，或者直接用箭头函数定义里面的处理方法。
* 传递参数时，也是通过调用箭头函数的方式或者bind方法传参。
* 代码示例：

```JSX
class Test extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      a: 1
    }
  }
  change = (a) => {
    this.setState({
      a
    })
  }
  render() {
    return (
      <div>
        <button onClick={() => this.change(5)}></button>
      </div>
    )
  }
}
```

### 生命周期

* ComponentWillMount --> render --> componentDidMount
  --> componentWillRecieveProps(父组件重新render() props改变) -->
  --> shouldComponentUpdate(state改变时) --> componentWillUpdate --> render --> componentDidMount
  --> componentWillUnmount(组件卸载时)