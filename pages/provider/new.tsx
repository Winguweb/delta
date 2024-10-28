import {NextPage} from "next";
import DetailsLancha from "../../components/organisms/Provider/DetailsLancha/DetailsLancha";
import Head from "next/head";

const CreateDevice: NextPage = () => {

    return (
        <div className="bg-ultra-light-blue">
            <Head>
                <title>Agregar Lancha</title>
            </Head>
            <DetailsLancha type="create" />
        </div>
    );
};

export default CreateDevice;
