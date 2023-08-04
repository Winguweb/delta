import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";
import Container from "../../Container";
import { useRouter } from "next/router";
import { signOut } from "next-auth/react";
import { useAuthenticatedUser } from "../../../../hooks/useAuthenticatedUser";
import Text from "../../../molecules/Text";
import { Button } from "../../../molecules/Buttons/Button";
import roleDict from "../../../../utils/rolesDictionary";

const Header: React.FC = () => {
    const user = useAuthenticatedUser();
    const router = useRouter();
  
    if (!user) {
      return null;
    }
  
    return (
      <div className="hidden lg:block bg-box-background">
        <Container className="py-8 flex justify-between">
          <div>
            <Text as="p1" className="font-bold">
              {user.firstName} {user.lastName}
            </Text>
            <Text as="p1" className="text-light-gray">
              {roleDict[user.role]}
            </Text>
          </div>
        </Container>
      </div>
    );
};

export {Header};