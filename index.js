let express = require('express');
let { employee } = require('./models/employee.model');
let { sequelize } = require('./lib/index');
let app = express();

app.use(express.json());

// Data
let employees = [
  {
    id: 1,
    name: 'John Doe',
    designation: 'Manager',
    department: 'Sales',
    salary: 90000,
  },
  {
    id: 2,
    name: 'Anna Brown',
    designation: 'Developer',
    department: 'Engineering',
    salary: 80000,
  },
  {
    id: 3,
    name: 'James Smith',
    designation: 'Designer',
    department: 'Marketing',
    salary: 70000,
  },
  {
    id: 4,
    name: 'Emily Davis',
    designation: 'HR Specialist',
    department: 'Human Resources',
    salary: 60000,
  },
  {
    id: 5,
    name: 'Michael Wilson',
    designation: 'Developer',
    department: 'Engineering',
    salary: 85000,
  },
  {
    id: 6,
    name: 'Sarah Johnson',
    designation: 'Data Analyst',
    department: 'Data Science',
    salary: 75000,
  },
  {
    id: 7,
    name: 'David Lee',
    designation: 'QA Engineer',
    department: 'Quality Assurance',
    salary: 70000,
  },
  {
    id: 8,
    name: 'Linda Martinez',
    designation: 'Office Manager',
    department: 'Administration',
    salary: 50000,
  },
  {
    id: 9,
    name: 'Robert Hernandez',
    designation: 'Product Manager',
    department: 'Product',
    salary: 95000,
  },
  {
    id: 10,
    name: 'Karen Clark',
    designation: 'Sales Associate',
    department: 'Sales',
    salary: 55000,
  },
];

app.get('/seed_db', async (req, res) => {
  try {
    await sequelize.sync({ force: true });

    await employee.bulkCreate(employees);

    return res.status(200).json({ message: 'Database seeding successful' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 1
async function fetchAllEmployees() {
  let employeesData = await employee.findAll();
  return { employeesData };
}

app.get('/employees', async (req, res) => {
  try {
    let response = await fetchAllEmployees();

    if (response.employeesData.length === 0) {
      return res.status(404).json({ message: 'Employee not found.' });
    }

    return res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2
async function addNewEmployee(newEmployee) {
  let createEmployee = await employee.create(newEmployee);
  return createEmployee;
}

app.post('/employees/new', async (req, res) => {
  try {
    let newEmployee = req.body;
    let response = await addNewEmployee(newEmployee);

    return res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3
async function updateEmployeeById(newEmployeeData, id) {
  let employeeDetails = await employee.findOne({ where: { id } });

  if (!employeeDetails) {
    return {};
  }

  employeeDetails.set(newEmployeeData);
  let updatedEmployee = await employeeDetails.save();

  return { message: 'Employee data updated successfully', updatedEmployee };
}

app.post('/employees/update/:id', async (req, res) => {
  try {
    let id = parseInt(req.params.id);
    let newEmployeeData = req.body;
    let response = await updateEmployeeById(newEmployeeData, id);

    if (!response.message) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    return res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 4
async function deleteEmployeeById(id) {
  let destroyData = await employee.destroy({ where: { id } });

  if (!destroyData) {
    return {};
  }

  return { message: 'Data deleted successfully' };
}

app.post('/employees/delete', async (req, res) => {
  try {
    let id = parseInt(req.body.id);
    let response = await deleteEmployeeById(id);

    if (!response.message) {
      return res.status(404).json({ message: 'Employee not found.' });
    }

    return res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PORT
app.listen(3000, () => {
  console.log('Server is running Port 3000');
});
