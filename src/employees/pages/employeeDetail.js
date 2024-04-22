import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { useEffect, useState,useCallback } from 'react';
import './employeeDetail.css'
import EmployeeDetailCard from './employeeDetailCard';
import EmployeeForm from './employeeForm';
import { toast } from 'react-toastify';
import { AuthContext } from '../../shared/context/authContext';
import { useContext } from 'react'; 

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

  
function Employee({modalFunctions,employeeId,isEdit,setIsEdit,handleEdit }) {
    const[employee,setEmployee] = useState(null)
    const[team,setTeam] = useState(null)
    const[manager,setManager] = useState(null);
    const auth = useContext(AuthContext);
    


    const onEditClickHandler = ()=>{
        setIsEdit(true);
    }

    const fetchEmployee = useCallback(async (url) => {
        const token = auth.token;    
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
            toast.error("Error fetching Employees",auth.toastOptions)
             console.error("Error fetching Employees:", error);
         }
     // eslint-disable-next-line react-hooks/exhaustive-deps
     },[auth.token])

     const fetchAll = useCallback(async()=>{
        let url = `http://localhost:8000/employees/${employeeId}`
        const data = await fetchEmployee(url)
        setEmployee(data[0])
        if(data[0] && data[0].team_id){
            url =  `http://localhost:8000/teams/${data[0].team_id}`
            const data1 = await fetchEmployee(url) 
            setTeam(data1[0])
            if(data1[0] && data1[0].manager_id){
                url =  `http://localhost:8000/teams/${data[0].team_id}/employees/manager`
                const data2 = await fetchEmployee(url) 
                setManager(data2[0])
            }
            else{
                setManager(null);
            }
        }
        else{
            setTeam(null)
            setManager(null)
        }

    },[employeeId,fetchEmployee])

    const onSubmitHandler = async(name,teamId,isManager,email,mobile,address,setErrors) => {
        const token = auth.token;
        try {
          const response = await fetch(`http://localhost:8000/employees/${employee.id}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json', 
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                "name":name,
                "team_id":teamId,
                "is_manager":isManager ? isManager : false,
                "email":email,
                "mobile":mobile,
                "address":address
            }),
          });
        
          if (!response.ok) {
            const data1 = await response.json()
            setErrors(JSON.parse(data1[0].message))
            return;
          }
        
          const data = await response.json(); 
          toast.success("employee edited successfully",auth.toastOptions)
          console.log('Response:', data);
          setIsEdit(false)
        } catch (error) {
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
      {
        employee &&
        <div>
        { !isEdit ?
            <EmployeeDetailCard 
                team={team} 
                employee={employee} 
                manager={manager}
                onEditClickHandler = {onEditClickHandler}
            />
        :
        <div className="data-container">
            {employee &&
                <EmployeeForm 
                employee={employee} 
                onSubmitHandler={onSubmitHandler}
            />}
        </div>
        }
      </div>
      }
    </Box>
  </Modal>
  </>);
}

export default Employee;