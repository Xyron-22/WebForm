import {VscAccount} from "react-icons/vsc"
import {AiOutlineFileAdd} from "react-icons/ai"
import { RxTable } from "react-icons/rx";
import {IoPersonAddOutline, IoCheckmarkDoneSharp, IoAnalyticsSharp} from "react-icons/io5"
import {MdOutlineAddCircleOutline, MdClose, MdOutlineLogout} from "react-icons/md"
import { LiaFileInvoiceDollarSolid } from "react-icons/lia";
import { TbBrandBooking, TbBrandProducthunt } from "react-icons/tb";

export default [
    {
        page: "Bookings",
        description: "Pending Orders",
        icon: <TbBrandBooking/>,
        route: "/orders/booking"
    },
    {
        page: "Invoiced",
        description: "Invoiced Orders",
        icon: <LiaFileInvoiceDollarSolid/>,
        route: "/orders/invoiced"
    },
    {
        page: "Paid",
        description: "Paid Orders",
        icon: <IoCheckmarkDoneSharp/>,
        route: "/orders/paid"
    },
  ];