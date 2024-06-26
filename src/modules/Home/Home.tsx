import { BaseLayout } from "../../layout/base"
import { Workspaces } from "./components/Workspaces"
import { Text } from "../../components/form/Text"

export const Home = () => {

    return (
        <BaseLayout>
            <Text variant='bold'>Wellcome, username!</Text>
            <Workspaces />
        </BaseLayout>   
    )
}