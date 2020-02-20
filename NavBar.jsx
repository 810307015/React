/**
 * 自定义的头部导航条组件
 */

import Taro, { Component } from "@tarojs/taro";
import { AtIcon } from 'taro-ui';

import './NavBar.scss';

const BASE_OPTION = {
  show: true, // 是否显示导航栏的内容，不显示会隐藏并保留位置
  extClass: '', // 自定义类名，用来覆盖默认样式
  color: '#FFFFFF', // 顶部导航栏的颜色
  background: '#0071fb', // 顶部导航栏的背景色
  back: true, // 是否有返回按钮，没有的时候展示leftChildren的内容
  leftChildren: '', // 左侧不显示返回按钮时的内容
  loading: false, // 是否正在加载中,加载中就显示loading动画
  title: '熊猫掌天下', // 标题，没有的时候显示centerChildren的内容
  centerChildren: '', // 没有填写标题时的填充
  rightChildren: '', // 右侧的填充
  delta: 1, // navigateBack的delta参数
};

class NavBar extends Component {

  static defaultProps = {
    option: { ...BASE_OPTION }
  }

  state = {
    ios: false, // 是否为ios系统
    statusBarHeight: 44, // 状态栏的高度
    innerWidth: 0, // 内部的高度
    innerPaddingRight: 0, // 内部容器右侧的填充
    leftWidth: 0, // 左侧返回按钮的宽度
  }

  goBack = () => {
    const { option } = this.props;
    const { delta = 1 } = option;
    console.log('goBack');
    wx.navigateBack({
      delta
    });
  };

  componentDidShow() {
    const isSupport = !!wx.getMenuButtonBoundingClientRect; // 获取右侧自带的胶囊菜单按钮的位置
    const rect = wx.getMenuButtonBoundingClientRect ? wx.getMenuButtonBoundingClientRect() : null;
    wx.getSystemInfo({ // 获取设备的相关信息
      success: (res) => {
        const ios = !!(res.system.toLowerCase().search('ios') + 1);
        this.setState({
          ios: ios,
          statusBarHeight: res.statusBarHeight,
          innerWidth: isSupport ? `${rect.left}px` : 0,
          innerPaddingRight: isSupport ? `${(res.windowWidth - rect.left)}px` : 0,
          leftWidth: isSupport ? `${(res.windowWidth - rect.left)}px` : 0
        });
      }
    });
  }

  render() {
    const { option = { ...BASE_OPTION } } = this.props;
    const { ios, statusBarHeight, innerWidth, innerPaddingRight, leftWidth } = this.state;
    const {
      show = true, // 是否显示导航栏的内容，不显示不保留位置
      extClass = '', // 自定义类名，用来覆盖默认样式
      color = '#FFFFFF', // 顶部导航栏的颜色
      background = '#0071fb', // 顶部导航栏的背景色
      back = true, // 是否有返回按钮，没有的时候展示leftChildren的内容
      leftChildren = '', // 左侧不显示返回按钮时的内容
      loading = false, // 是否正在加载中,加载中就显示loading动画
      title = '熊猫掌天下', // 标题，没有的时候显示centerChildren的内容
      centerChildren = '', // 没有填写标题时的填充
      rightChildren = '', // 右侧的填充
    } = option;

    return (
      <View class={`weui-navigation-bar ${extClass}`} style={{ display: show ? 'block' : 'none' }}>
        <View class={`weui-navigation-bar__placeholder ${ios ? 'ios' : 'android'}`} style={{ paddingTop: `${statusBarHeight}px`, visibility: 'hidden' }}></View>
        <View class={`weui-navigation-bar__inner ${ios ? 'ios' : 'android'}`} style={{ paddingTop: `${statusBarHeight}px`, color: color, background: background, paddingRight: innerPaddingRight, width: innerWidth }}>

          <View class='weui-navigation-bar__left' style={{ width: leftWidth }}>
            { back ? <View onClick={this.goBack} class="weui-navigation-bar__buttons">
              <AtIcon value='chevron-left' size='15' color='#FFF'></AtIcon>
            </View> : leftChildren }
          </View>

          <View class='weui-navigation-bar__center'>

            {
              loading &&
              <View class="weui-navigation-bar__loading">
                <View class="weui-loading" style={{ width: `${size.width}rpx`, height: `${size.height}rpx` }}></View>
              </View>
            }
            {
              title ?
                <Text>{title}</Text>
                : centerChildren
            }
          </View>

          <View class='weui-navigation-bar__right'>
            {rightChildren && rightChildren}
          </View>
        </View>
      </View>
    );
  }
}

export default NavBar;