import React,{useState,useEffect} from 'react';
import Auth from './Auth';
import ListHeader from './ListHeader';
import ListItem from './ListItem';
import {useCookies} from 'react-cookie';
const App = ()=> {
  const [cookies,setCookie,removeCookie] = useCookies("");

  const authToken = cookies.AuthToken;
  const email = cookies.Email;
  const [tasks,setTasks] = useState(null);
  const  getData = async () =>{
    try {
      const response = await fetch(`${process.env.REACT_APP_PORT_URL}/todos/${email}`)
      const json = await response.json();
      setTasks(json);
    } catch (err) {
      console.log(err);
    }
  }
  useEffect(()=> {if(authToken){
    getData()
  }},[])
  console.log(tasks);

  // Sort by date .
  const sortedTasks = tasks?.sort((a,b)=> new Date(a.date)- new Date(b.date));
  return (
    <div className='app'>
      {authToken ? <div>
      <ListHeader listName = "Holiday tick list" getData = {getData}/>
      <p className='user-email'> Welcome back {email}</p>
      {sortedTasks?.map((task) => <ListItem key = {task.id} task = {task} getData = {getData}/>)}
      
      </div> : <Auth/>}
      <footer>
        <p className='copyright'>© Pushkar Shah LLC</p>
      </footer>
    </div>
  );
}

export default App;
