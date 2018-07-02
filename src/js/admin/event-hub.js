window.eventHub = {
  // events 对象用来保存事件和函数集合
  events:{},
  // 发布事件, 调用事件对于的 回调函数
  emit(eventName, data){
    for(let key in this.events){
      if (key === eventName){
        let fnList = this.events[key] 
        // 调用回调函数集合上的每一个item
        fnList.map((fn)=>{
          fn.call(undefined, data)
        })
      }
    }
  },
  // 订阅 (实现事件和回调函数的映射)
  on(eventName, fn){

    // 初始化一个空数组作为订阅者的回调函数集合容器
    if(this.events[eventName] === undefined){
      this.events[eventName] = []
    } 
    this.events[eventName].push(fn)
  },
  off(){

  }
}
