import {VscAccount} from "react-icons/vsc"
import {AiOutlineFileAdd} from "react-icons/ai"
import { RxTable } from "react-icons/rx";
import {IoPersonAddOutline, IoCheckmarkDoneSharp, IoAnalyticsSharp} from "react-icons/io5"
import {MdOutlineAddCircleOutline, MdClose, MdOutlineLogout} from "react-icons/md"
import { LiaFileInvoiceDollarSolid } from "react-icons/lia";
import { TbBrandBooking, TbBrandProducthunt } from "react-icons/tb";

export default [
    {
        page: "New Order",
        description: "Book an order",
        icon: <AiOutlineFileAdd/>,
        route: "/form/order"
    },
    {
        page: "New Account",
        description: "Add new account",
        icon: <IoPersonAddOutline/>,
        route: "/form/account"
    },
    {
        page: "New Product",
        description: "Add new product",
        icon: <MdOutlineAddCircleOutline/>,
        route: "/form/product"
    },
  ];