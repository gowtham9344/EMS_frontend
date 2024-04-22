import React, { useState, useEffect,useContext } from 'react';
import './listEmployees.css'
import Card from '../components/card';
import NoContainer from '../../shared/components/noContainer';
import AddButton from '../../shared/components/addButton';
import SearchForm from '../../shared/components/searchForm';
import AddEmployee from './addEmployee';
import Employee from './employeeDetail';
import { AuthContext } from '../../shared/context/authContext';
import { toast } from 'react-toastify';

function ListEmployees() {
  const [employees,setEmloyees] = useState([])
  const [open, setOpen] = React.useState(false);
  const [employeeId,setEmployeeId] = React.useState(null)
  const [isEdit,setIsEdit] = useState(false);
  const [isDelete,setIsDelete] = useState(0);
  const [newEmployee,setNewEmployee] = useState(false)
  const [isSearch,setIsSearch] = useState(false)
  const [searchValue,setSearchValue] = useState("");
  const auth = useContext(AuthContext);


  const handleOpen = (teamId) => {
    setEmployeeId(teamId)
    setOpen(true);
  }
  const handleClose = () => {
    setEmployeeId(null)
    setOpen(false);
  }

  let modalFunctions = {
    open,
    handleClose,
    handleOpen
  }

  const handleNew = ()=>{
    setNewEmployee(!newEmployee);
    setOpen(!open);
  }

  const handleEdit = ()=>{
    setIsEdit(false);
    setOpen(false);
  }

  const handleSearch = (value)=>{
    setIsSearch(value);
  }

  const fetchTeams = async (url) => {
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
        setEmloyees(data);
    } catch (error) {
        toast.error("Error fetching employees",auth.toastOptions)
        console.error("Error fetching employees:", error);
    }
};

useEffect(() => {
    let url = "http://localhost:8000/employees";
    if(!isSearch){
      fetchTeams(url);
    }else{
      fetchTeams(`${url}/search?key=${searchValue}`);
    }
// eslint-disable-next-line react-hooks/exhaustive-deps
},[isEdit,newEmployee,isSearch,isDelete]);

  return (
    <>
     {
      !open && 
      <SearchForm type="employee" handleSearch={handleSearch} setSearchValue={setSearchValue} searchValue={searchValue} isSearched={isSearch}/>
     }
     {
        auth.isAdmin && <AddButton active={!newEmployee && !open} handleNew={handleNew}/>
     }
     {
        newEmployee && open && 
        <AddEmployee
          modalFunctions={modalFunctions}
          handleNew = {handleNew}
        />
     }
     {
        !newEmployee && open && <Employee modalFunctions={modalFunctions} employeeId={employeeId} isEdit={isEdit} handleEdit={handleEdit} setIsEdit={setIsEdit}/>
     }
     {employees.length > 0 ? (
        <div className="index-container">
          <div className="main-container">
            {employees.map((employee) => {
                employee.show = `/employees/${employee.id}/`
                
                return <Card detail={employee} key={employee.id} modalFunctions={modalFunctions} setIsDelete={setIsDelete}/>
            })}
          </div>
        </div>
      ) : (
        <NoContainer information="no Employee available"/>
      )}
    </>
  );
}

export default ListEmployees;