// import react from 'react';
const ProgressBar = ({progress})=> {
  const colors = [ 'red' ,'blue','green','purple']
  const randomColor = colors[Math.floor(Math.random()*colors.length)];
  return (
    
    <div className="outer-bar" >
      <div className="inner-bar"
        style={{width : `${progress}%`,backgroundColor : randomColor}}
      >

      </div>
    </div>
  );
}

export default ProgressBar;
