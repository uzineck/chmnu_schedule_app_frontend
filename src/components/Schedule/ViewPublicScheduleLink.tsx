import { AiOutlineEye } from "react-icons/ai";
import { Subgroup } from "../../models/enums/Subgroup.ts";
import { ViewPublicLinkButton } from "./scheduleScreenStyled.ts";

interface ViewPublicScheduleLinkProps {
    groupUuid: string;
    subgroup?: Subgroup | null;
    weekType?: boolean;
}

const ViewPublicScheduleLink = ({ groupUuid, subgroup, weekType }: ViewPublicScheduleLinkProps) => {
    const params = new URLSearchParams();
    if (weekType !== undefined) params.set("weekType", weekType.toString());
    if (subgroup) params.set("subgroup", subgroup);
    const qs = params.toString();
    const to = `/group/${groupUuid}/lessons${qs ? `?${qs}` : ""}`;

    return (
        <ViewPublicLinkButton to={to}>
            <AiOutlineEye size={18} /> Переглянути загальний розклад
        </ViewPublicLinkButton>
    );
};

export default ViewPublicScheduleLink;
