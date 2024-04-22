import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { useEffect, useState,useCallback,useContext } from 'react';
import './teamDetail.css'
import TeamDetailCard from './teamDetailCard';
import TeamForm from './teamform';
import { toast } from 'react-toastify';
import { AuthContext } from '../../shared/context/authContext';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'transparent',
    boxShadow: 63,
    overflow: 'hidden',
    p: 4,
    color: 'black'
};

  
function Team({modalFunctions,teamId,isEdit,setIsEdit,handleEdit }) {
    const[team,setTeam] = useState(null)
    const[employees,setEmployees] = useState([])
    const[manager,setManager] = useState(null)
    const auth = useContext(AuthContext);
    

    const onEditClickHandler = ()=>{
        setIsEdit(true);
    }

    const fetchTeam = useCallback(async (url) => {
        const token = auth.token   
        try {
             const response = await fetch(url, {
                 headers: {
                     'Authorization': `Bearer ${token}`
                 }
             });
             if (!response.ok) {
                 throw new Error(`HTTP error! Status: ${response.status}`);
             }
             const data = await response.json();
             return data;
         } catch (error) {
             toast.error("Error fetching teams",auth.toastOptions)
             console.error("Error fetching teams:", error);
         }
     // eslint-disable-next-line react-hooks/exhaustive-deps
     },[auth.token])

     const fetchAll = useCallback(async()=>{
        let url = `http://localhost:8000/teams/${teamId}`
        const data = await fetchTeam(url)
        setTeam(data[0])
        url = `http://localhost:8000/teams/${teamId}/employees`
        const data1 = await fetchTeam(url)
        setEmployees(data1)
        url = `http://localhost:8000/teams/${teamId}/employees/manager`
        const data2 = await fetchTeam(url)
        console.log(data2)
        setManager(data2[0])
    },[teamId,fetchTeam])

    const onSubmitHandler = async(name,managerId,employeeList,setErrors) => {
        const token = auth.token;
        try {
          const response = await fetch(`http://localhost:8000/teams/${team.id}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json', 
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
              "name":name,
              "manager_id":managerId,
              "employer_ids":employeeList
            }),
          });
        
          if (!response.ok) {
            const data1 = await response.json()
            setErrors(JSON.parse(data1[0].message))
            return;
          }
        
          const data = await response.json(); 
          toast.success("team edited successfully",auth.toastOptions)
          console.log('Response:', data);
          setIsEdit(false)
        } catch (error) {
          console.log(error)
          toast.error("something went wrong please try again after sometimes",auth.toastOptions)
        }

      }

    useEffect(()=>{
        fetchAll()
    },[fetchAll,isEdit])

    return (<>
    <Modal
        open={modalFunctions.open}
        onClose={handleEdit}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        style={{ backdropFilter: "blur(10px)" }}
    >
    <Box sx={style}>
      <div>
        { !isEdit ?
            <TeamDetailCard 
                team={team} 
                manager={manager} 
                employees={employees} 
                onEditClickHandler = {onEditClickHandler}
            />
        :
        <div className="data-container">
            {team &&
                <TeamForm 
                team={team} 
                manager={manager} 
                employees={employees} 
                setIsEdit = {setIsEdit}
                onSubmitHandler={onSubmitHandler}
            />}
        </div>
        }
      </div>
    </Box>
  </Modal>
  </>);
}

export default Team;