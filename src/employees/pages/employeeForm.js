import React, { useState, useEffect,useCallback,useContext } from 'react';
import './employeeForm.css'
import InputField from '../../shared/components/inputField';
import SelectField from '../../shared/components/selectField';
import { AuthContext } from '../../shared/context/authContext';
import { toast } from 'react-toastify';

function EmployeeForm({ employee,onSubmitHandler }) {
  const [name,setName] = useState(employee ? employee.name: "")
  const [email,setEmail] = useState(employee ? employee.email: "")
  const [mobile,setMobile] = useState(employee ? employee.mobile: "")
  const [address,setAddress] = useState(employee ? employee.address: "")
  const [isManager,setIsManager] = useState(employee ? employee.is_manager: null)
  const [teamId,setTeamId] = useState(employee ? employee.team_id: null)
  const [teamList,setTeamList] = useState(null)
  const [errors, setErrors] = useState({});
  const auth = useContext(AuthContext);


  const fetchAvailableEmployees = useCallback(async () => {
    const token = auth.token;
    try {
      const response = await fetch(`http://localhost:8000/teams/`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      const arr = data.map(team => ({
        teamID: team.id,
        teamName: team.name
      }));
      setTeamList([...arr]);
    } catch (error) {
      toast.error("Error fetching teams",auth.toastOptions)
      console.error("Error fetching teams:", error);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth.token]);

  useEffect(() => {
    fetchAvailableEmployees();
  }, [fetchAvailableEmployees]);

  const handleValidation = () => {
    const errors = {};
  
    if(name === ''){
      errors.name = "Name can't be empty.";
    }

    if(email === ''){
      errors.email = "Email can't be empty.";
    }

    if(mobile === ''){
      errors.mobile = "Mobile Number can't be empty.";
    }

    if(address === ''){
      errors.address = "Address can't be empty.";
    }

    return errors;
  };

  const handleEmailchange = (event) => {
    setEmail(event.target.value);
  };

  const handleAddressChange = (event) => {
    setAddress(event.target.value);
  };

  const handleMobileChange = (event) => {
    setMobile(event.target.value);
  };

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleTeamIdChange = (event) => {
    
    if(event.target.value === ''){
      setTeamId(null);
      setIsManager(false);
    }else{
      setTeamId(event.target.value)
    }
  };

  const handleIsManagerChange = (event) => {
    setIsManager(event.target.checked);
  };

  const onSubmit = async(event)=>{
    event.preventDefault();

    const validationErrors = handleValidation();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    await onSubmitHandler(name,teamId,isManager,email,mobile,address,setErrors)
  }

  return (
    <form onSubmit={onSubmit}>
    <InputField
      label="Name"
      value={name}
      onChange={handleNameChange}
      required
      errors={errors}
    />
    <InputField
      label="Email"
      value={email}
      onChange={handleEmailchange}
      required
      errors={errors}
    />
    <InputField
      label="Mobile"
      value={mobile}
      onChange={handleMobileChange}
      required
      errors={errors}
    />
    <InputField
      label="Address"
      value={address}
      onChange={handleAddressChange}
      required
      errors={errors}
    />
    {
      teamList &&
      <SelectField
        label="Select Team"
        value={!teamId ? '' : teamId}
        options={[
          { value: '', label: 'No Team' },
          ...teamList.map(team => ({ value: team.teamID, label: team.teamName }))
        ]}
        onChange={handleTeamIdChange}
      />
    } 
    {teamId && (
      <div id="is-manager-section">
        <label htmlFor="is_manager">Is Manager</label>
        <input
          type="checkbox"
          id="is_manager"
          checked={isManager}
          onChange={handleIsManagerChange}
        />
      </div>
    )}
    <div className="submit-button">
      <button type="submit">Submit</button>
    </div>
  </form>
  );
}

export default EmployeeForm;
