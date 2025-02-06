import React from 'react'
import AdminLayout from '../../components/layout/AdminLayout'
import Table from '../../components/shared/Tabel'

const colums=[
  {
    field:"id",
    headerName:"ID",
    headerClassName:"table-header",
    width:200
  }
]
const UserManagement = () => {
  return (
    <AdminLayout>
        <Table heading={"All Users"} colums={colums}/>
    </AdminLayout>
  )
}

export default UserManagement