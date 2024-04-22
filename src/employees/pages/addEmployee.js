import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import EmployeeForm from './employeeForm';
import { toast } from 'react-toastify';
import { useContext } from 'react';
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

export default function AddEmployee({modalFunctions, handleNew}){
    const auth = useContext(AuthContext);

    const onSubmitHandler = async(name,teamId,isManager,email,mobile,address,setErrors) => {
        const token = auth.token;
        try {
          const response = await fetch(`http://localhost:8000/employees`, {
            method: 'POST',
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
            console.log(data1)
            setErrors(JSON.parse(data1[0].message))
            return;
          }
          
          const data = await response.json(); // Parse the response body as JSON
          toast.success("Employee created successfully",auth.toastOptions)
          console.log('Response:', data);
          handleNew();
        } catch (error) {
          toast.error("something went wrong please try again after sometimes",auth.toastOptions)
          console.error('Error:', error);
        }
        
      }

    return (<>
        <Modal
            open={modalFunctions.open}
            onClose={handleNew}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            style={{ backdropFilter: "blur(10px)" }}
        >
        <Box sx={style}>
          <div>
            <div className="data-container">
                <EmployeeForm
                    employee={null}
                    onSubmitHandler={onSubmitHandler}
                />
            </div>
          </div>
        </Box>
      </Modal>
      </>);
}