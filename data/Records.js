import {VscAccount} from "react-icons/vsc"
import {AiOutlineFileAdd} from "react-icons/ai"
import { RxTable } from "react-icons/rx";
import {IoPersonAddOutline, IoCheckmarkDoneSharp, IoAnalyticsSharp} from "react-icons/io5"
import {MdOutlineAddCircleOutline, MdClose, MdOutlineLogout} from "react-icons/md"
import { LiaFileInvoiceDollarSolid } from "react-icons/lia";
import { TbBrandBooking, TbBrandProducthunt } from "react-icons/tb";

export default [
    {
        page: "Orders",
        description: "All Order Records",
        icon: <RxTable/>,
        route: "/records/order"
    },
    {
        page: "Accounts",
        description: "Records of Accounts",
        icon: <VscAccount/>,
        route: "/records/account"
    },
    {
        page: "Products",
        description: "Records of Products",
        icon: <TbBrandProducthunt/>,
        route: "/records/product"
    },
  ];