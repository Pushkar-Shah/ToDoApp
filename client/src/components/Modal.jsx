/* eslint-disable react-hooks/rules-of-hooks */
import react,{useState} from 'react';
import {useCookies} from 'react-cookie';
const Modal = ({mode,setShowModal,task,getData})=> {

  const [cookies,setCookie,removeCookie] = useCookies("");
  // const mode = 'create'
  const editMode = mode === 'edit' ? true : false;
  const [data,setData] = useState(
    {
      user_email:editMode ? task.user_email : cookies.Email,
      title :editMode ? task.title : '' ,
      progress :editMode ? task.progress : 50,
      date : editMode ? task.date : new Date()
    }
  )


  const editData = async(e) =>{
    e.preventDefault();
    try {
      const response = await fetch(`${process.env.REACT_APP_PORT_URL}/todos/${task.id}`,{
        method : 'PUT',
        headers : {'Content-type' : 'application/json'},
        body:JSON.stringify(data)
        
      });
      console.log(response.status);
      if (response.status === 200){
        setShowModal(false)
        getData()
      }
      
    } catch (error) {
      console.log(error);
    }
  }


  const postData = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${process.env.REACT_APP_PORT_URL}/todos`,{
        method:"POST",
        headers : {'Content-type' : 'application/json'},
        body: JSON.stringify(data)
      });
      if (response.status === 200){
        setShowModal(false)
        getData()
      }
    } catch (error) {
      
    }
  }
  
  function handleChange(e){
    console.log('changed',e)
    const{name,value} = e.target;

    setData((data)=> ({ ...data,[name]:value
    }))
  }
  return (
    <div className="overlay">
      <div className="modal">
      <div className="form-title-container">
        <h3>Let's {mode} your task</h3>
        <button onClick={()=> setShowModal(false)}>X</button>
      </div>
      
      <form >
        <input type="text" 
        required maxLength={30}
        placeholder="Your task goes here"
        name = 'title'
        value = {data.title}
        onChange={handleChange}/>
        <br/>
        <label for="range">Drag to select your current progress</label>
        <input 
        type="range"
        id ='range' 
        required
         min  = {0}
        maxLength={30}
        placeholder="Your task goes here"
        name = 'progress'
        value = {data.progress}
        onChange={handleChange}/>
        <input className= {mode} type="submit" onClick= {editMode ? editData : postData}/>
      </form>
      </div>
    </div>
  );
}

export default Modal;
