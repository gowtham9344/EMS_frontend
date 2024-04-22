import React, { useState, useEffect, useContext } from 'react';
import './listTeam.css'
import Card from '../components/card';
import Team from './teamDetail';
import NoContainer from '../../shared/components/noContainer';
import AddButton from '../../shared/components/addButton';
import AddTeam from './addTeam';
import SearchForm from '../../shared/components/searchForm';
import { AuthContext } from '../../shared/context/authContext';
import { toast } from 'react-toastify';

function ListTeams() {
  const [teams,setTeams] = useState([])
  const [open, setOpen] = React.useState(false);
  const [teamId,setTeamId] = React.useState(null)
  const [isEdit,setIsEdit] = useState(false);
  const [newTeam,setNewTeam] = useState(false)
  const [isSearch,setIsSearch] = useState(false)
  const [isDelete,setIsDelete] = useState(0);
  const [searchValue,setSearchValue] = useState("");
  const auth = useContext(AuthContext);

  const handleOpen = (teamId) => {
    setTeamId(teamId)
    setOpen(true);
  }
  const handleClose = () => {
    setTeamId(null)
    setOpen(false);
  }

  let modalFunctions = {
    open,
    handleClose,
    handleOpen
  }

  const handleNew = ()=>{
    setNewTeam(!newTeam);
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
        setTeams(data);
    } catch (error) {
        toast.error("Error fetching teams",auth.toastOptions)
        console.error("Error fetching teams:", error);
    }
};

useEffect(() => {
    let url = "http://localhost:8000/teams";
    if(!isSearch){
      fetchTeams(url);
    }else{
      fetchTeams(`${url}/search?key=${searchValue}`);
    }
// eslint-disable-next-line react-hooks/exhaustive-deps
},[isEdit,newTeam,isSearch,isDelete]);

  return (
    <>
     {
      !open && 
      <SearchForm type="team" handleSearch={handleSearch} setSearchValue={setSearchValue} searchValue={searchValue} isSearched={isSearch}/>
     }
     {
        auth.isAdmin && <AddButton active={!newTeam && !open} handleNew={handleNew}/>
     }
     {
        newTeam && open && 
        <AddTeam 
          modalFunctions={modalFunctions}
          handleNew = {handleNew}
        />
     }
     {
        !newTeam && open && <Team modalFunctions={modalFunctions} teamId={teamId} isEdit={isEdit} handleEdit={handleEdit} setIsEdit={setIsEdit}/>
     }
     {teams.length > 0 ? (
        <div className="index-container">
          <div className="main-container">
            {teams.map((team) => {
                team.show = `/teams/${team.id}/`
                
                return <Card detail={team} key={team.id} modalFunctions={modalFunctions} setIsDelete={setIsDelete}/>
            })}
          </div>
        </div>
      ) : (
        <NoContainer information="no team available"/>
      )}
    </>
  );
}

export default ListTeams;