import { NextPage } from 'next';
import Head from 'next/head';
import { useState } from 'react';
import AdminLayout from '../../../components/organisms/Layout/AdminLayout';
import Text from '../../../components/molecules/Text';
import Tabs from '../../../components/molecules/Tabs';
import Requests from '../../../components/organisms/Admin/UsersAdmin/Requests';
import Users from '../../../components/organisms/Admin/UsersAdmin/Users';

const UsersPage: NextPage = (props) => {
  const [refreshUsers, setRefreshUsers] = useState(0);

  const handleRefreshUsers = () => {
    setRefreshUsers((prevState) => prevState + 1);
  };

  return (
    <>
      <Head>
        <title> Delta - Usuarios</title>
      </Head>

      <AdminLayout title="Usuarios">
        <div className="h-full flex flex-col space-y-6">
          <Text as="h3">Usuarios</Text>
          <div className="bg-white p-6 rounded-2xl overflow-x-auto">
            {<Tabs
              headers={['Solicitudes', 'Usuarios']}
              content={[
                <Requests
                  key="requests-tab-content"
                  onRefresh={handleRefreshUsers}
                />,
                <Users key="users-tab-content" refresh={refreshUsers} />,
              ]}
            />}
          </div>
        </div>
      </AdminLayout>
    </>
  );
};

export default UsersPage;
