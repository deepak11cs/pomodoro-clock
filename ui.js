class Controls extends React.Component{
    constructor(props){
      super(props);
    }
    render(){
      let cl = "fa fa-play";
      if(this.props.lock){
         cl = "fas fa-pause";
      }
      return ( 
        <div id="controls">
          <a id="start_stop" onClick={this.props.onClick} name="startstop"><i class={cl}></i></a>
          <a id="reset" onClick={this.props.onClick} name="reset"><i class="fas fa-undo"></i></a>
        </div>
      );
    }
  }
  class Timer extends React.Component{
    constructor(props){
      super(props);
    }
    render(){
      return (
        <div id="timer">
          <div id="timer-label">
            {this.props.active}
          </div>
          <div id="time-left">
            {(this.props.minutes<10)?`0${this.props.minutes}`:this.props.minutes}:{(this.props.seconds<10)?`0${this.props.seconds}`:this.props.seconds}
          </div>
        </div>
      );
    }
  }
  
  class Session extends React.Component{
    constructor(props){
      super(props);
    }
    render(){
      return (
        <div id="session">
          <div id="session-label">
            Session Length
          </div>
          <div id="session-control">
            <a id="session-decrement" class="button" name="session" data-value="decrement" onClick={this.props.onClick}><i class="fas fa-arrow-down"></i></a>
            <span id="session-length">{this.props.sessionLength}</span>
            <a id="session-increment" class="button" name="session" data-value="increment" onClick={this.props.onClick}><i class="fas fa-arrow-up"></i></a>
          </div>
        </div>
        
      );
    }
  }
  class Break extends React.Component{
    constructor(props){
      super(props);
    }
    render(){
      return (
        <div id="break">
          <div id="break-label">
            Break Length
          </div>
          <div id="break-control">
            <a id="break-decrement" data-value="decrement" name="break" onClick={this.props.onClick} class="button"><i class="fas fa-arrow-down"></i></a>
            <span id="break-length">{this.props.breakLength}</span>
            <a id="break-increment" onClick={this.props.onClick} data-value="increment" name="break" class="button"><i class="fas fa-arrow-up"></i></a>
          </div>
        </div>
        
      );
    }
  }
  class Settings extends React.Component{
    constructor(props){
      super(props);
    }
    render(){
      return (
        <div id="settings">
            <Break breakLength={this.props.breakLength} onClick={this.props.onClick}/>
            <Session sessionLength={this.props.sessionLength} onClick={this.props.onClick}/>
        </div>
      );
    }
  }
  class App extends React.Component{
    constructor(props){
      super(props);
      this.state={
        breakLength: 5,
        sessionLength: 25,
        minutes: 25,
        seconds: 0,
        lock: false,
        intervalId: "",
        active: "Session",
        audio: ""
      }
      this.clickHandler = this.clickHandler.bind(this);
      this.runtime = this.runtime.bind(this);
    }
    componentDidMount(){
      this.setState({
        audio: document.getElementById("beep")
      });
    }
    runtime(){
      if(this.state.seconds>0){
        this.setState((state)=>({
          minutes: state.minutes,
          seconds: state.seconds-1
        }));
      }
      else{
        if(this.state.minutes>0 && this.state.seconds==0){
          this.setState((state)=>({
            minutes: state.minutes - 1,
            seconds: 59
          }));
        }
        else if(this.state.minutes>0){
          this.setState((state)=>({
            minutes: state.minutes - 1,
            seconds: state.seconds - 1
          }));
        }
        else{
          
          clearInterval(this.state.intervalId);
          this.state.audio.play();
          console.log(this.state.audio);
          this.setState({
            intervalId: ""
          });
          if(this.state.active == "Session"){
            this.setState((state)=>({
              active: "Break",
              minutes: state.breakLength,
              seconds: 0,
              intervalId: setInterval(this.runtime,1000)
            }));
          }
          else{
            this.setState((state)=>({
              active: "Session",
              minutes: state.sessionLength,
              seconds: 0,
              intervalId: setInterval(this.runtime,1000)
            }));
          }
          
        }
      }
      
    }
    clickHandler(event){
      event.preventDefault();
      //console.log(event);
      if(this.state.lock){
  
        if(event.currentTarget.name == "startstop"){
          clearInterval(this.state.intervalId);
          this.setState((state)=>({
            lock: false,
            intervalId: ""
          }));
        }
        else if(event.currentTarget.name == "reset"){
          this.state.audio.pause();
          this.state.audio.currentTime=0;
          clearInterval(this.state.intervalId);
          this.setState((state)=>({
            lock: false,
            minutes: 25,
            seconds: 0,
            sessionLength: 25,
            breakLength: 5,
            intervalId: "",
            active: "Session"
          }));
        }
      }
      else{
        if(event.currentTarget.name == "startstop"){
          this.setState((state)=>({
            lock: true,
            intervalId: setInterval(this.runtime,1000)
          }));
        }
        else if(event.currentTarget.name == "reset"){
          this.state.audio.pause();
          this.state.audio.currentTime = 0;
          this.setState((state)=>({
            lock: false,
            minutes: 25,
            seconds: 0,
            sessionLength: 25,
            breakLength: 5,
            intervalId: "",
            active: "Session",
          }));
        }
        else if(event.currentTarget.name =="session"){
          if(this.state.minutes < this.state.sessionLength){
            this.setState((state)=>({
              minutes: 25,
              seconds: 0
            }));
          }
          if(event.currentTarget.dataset.value == "increment"){
            if(!(this.state.sessionLength>59))
            this.setState((state)=>({
              sessionLength: state.sessionLength + 1,
              minutes: state.minutes +1,
              seconds: 0
            }));
          }
          else{
            if(!(this.state.sessionLength==1))
            this.setState((state)=>({
              sessionLength: state.sessionLength -1,
              minutes: state.minutes -1,
              seconds: 0
            }))
          }
        }
        else{
          if(event.currentTarget.dataset.value == "increment"){
            if(!(this.state.breakLength>59))
            this.setState((state)=>({
          breakLength: state.breakLength + 1
        }));
          }
          else{
            if(!(this.state.breakLength==1))
            this.setState((state)=>({
              breakLength: state.breakLength - 1
            }));
          }
        }
      }
      
    }
    render(){
      return (
        <div id="container">
          <Settings breakLength={this.state.breakLength} sessionLength={this.state.sessionLength} onClick={this.clickHandler}/>
          <Timer minutes={this.state.minutes} seconds={this.state.seconds} active={this.state.active}/>
          <Controls lock={this.state.lock} onClick={this.clickHandler}/>
          <audio id="beep" preload="auto" 
           src="http://soundbible.com/grab.php?id=529&type=mp3" type="audio/mp3"></audio>
        </div>
      );
      
    }
  }
  
  
  ReactDOM.render(<App />, document.getElementById('app'));