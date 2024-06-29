import react,{useState} from 'react';
import TickIcon from './TickIcon'
import ProgressBar from './ProgressBar';
import Modal from './Modal';

const ListItem = ({task,getData})=> {

  const deleteData = async (e)=>{
    e.preventDefault();
    try {
      
      const response = await fetch(`${process.env.REACT_APP_PORT_URL}/todos/${task.id}`,{
        method : 'DELETE'
      });
      console.log(response.status);
      if (response.status === 200){
        getData()
      }
      console.log(`${process.env.PORT_URL}/todos/${task.id}`);
      
    } catch (error) {
      console.log(error);
    }
  }


  const [showModal,setShowModal]= useState(false)
  return (
    <div className="list-item">
      <div className="info-container">
      <TickIcon/>
      <p className="task-title"> {task.title} </p>
      <ProgressBar progress={task.progress}/>
      </div>
      <div className="button-container">
        <button className='edit' onClick={()=> setShowModal(true)}>Edit</button>
        <button className='delete' onClick= {deleteData }>Delete</button>
      </div>
      {showModal && <Modal mode = {'edit'} setShowModal={setShowModal} task = {task} getData={getData}/>}
    </div>
  );
}

export default ListItem;
