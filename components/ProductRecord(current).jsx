"use client"

import React, { useState, useLayoutEffect, useMemo } from 'react'
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import ReactLoading from "react-loading";
import useStore from '@/stateManagement/store';
import { IoPencil } from "react-icons/io5";
import {AiOutlineDownload, AiOutlineReload} from "react-icons/ai"
import { MdArrowForwardIos } from "react-icons/md";
import DrawerNav from './DrawerNav';
import {
    Card,
    CardHeader,
    Typography,
    Button,
    CardBody,
    Chip,
    CardFooter,
    IconButton,
    Tooltip,
    Input,
    Select, 
    Option,
    Checkbox,
    Alert,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
  } from "@material-tailwind/react";

  const TABLE_HEAD = ["Material Code", "Material Description", "Product Family", "UOM", "Stocks", "", ""];
  
 
const ProductRecord = () => {
 
    const router = useRouter()

    const token = useStore((state) => state.token)

    const [decodedJWTToken, setDecodedJWTToken] = useState("")
    const [isLoading, setIsLoading] = useState(true)
    const [errorInformation, setErrorInformation] = useState("")
    const [disableButton, setDisableButton] = useState(false)
    const [openAlert, setOpenAlert] = useState({
      status: false,
      message: "",
      color: "green"
    })
    let timeOut;
    const [toggleModify, setToggleModify] = useState(false)
    const [openDeleteDialogue, setOpenDeleteDialogue] = useState(false);
    const [openEditDialogue, setOpenEditDialogue] = useState(false)
    const [openDrawer, setOpenDrawer] = useState(false)

    const [paginated, setPaginated] = useState(true)
    const [currentPage, setCurrentPage] = useState(1)

    const numberOfItemsPerPage = 100
    

    //handler for switching openDeleteDialogue
    const handleOpenDeleteDialogue = () => setOpenDeleteDialogue(!openDeleteDialogue)
    //handler for switching openEditDialogue
    const handleOpenEditDialogue = () => {
      setOpenEditDialogue(!openEditDialogue)
      setProductToEdit({})
    }

    const [initialProductRecordsShown, setInitialProductRecordsShown] = useState([])
    const [productRecordsShown, setProductRecordsShown] = useState([])
    const [chosenFilter, setChosenFilter] = useState({
      label: "",
      function: null
    })
    const [setOfProductIdsToDelete, setSetOfProductIdsToDelete] = useState(new Set())
    const [productToEdit, setProductToEdit] = useState({})

    //handler for editing order object to edit
    const handleSetProductToEdit = (e) => {
      setProductToEdit({...productToEdit, [e.target.name]: e.target.name === "uom" || e.target.name === "stocks" ? Number(e.target.value) : e.target.value})
    }

    //function for fetching all order records
    const fetchAllProducts = async () => {
        setDisableButton(true)
        try {
            setIsLoading(true)
            const {data} = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/form/product`)
            if (paginated) {
              const arrayOfProductsInPage = data.data.filter((product, index) => index < (numberOfItemsPerPage * currentPage) && index >= numberOfItemsPerPage * (currentPage - 1))
              setProductRecordsShown(arrayOfProductsInPage)
            } else {
              setProductRecordsShown(data.data)
            }
            setInitialProductRecordsShown(data.data)
            setIsLoading(false) 
        } catch (error) {
          if (error?.response?.data) {
            if (error.response.data.message === "jwt expired") {
              clearTimeout(timeOut)
              setOpenAlert({
                status: true,
                message: "Session expired, please login again",
                color: "orange"
              })
              timeOut = setTimeout(() => {
                setOpenAlert({
                    ...openAlert,
                  status: false,
                  message: "",
                })
                Cookies.remove("jwt")
                router.replace("/auth/login")
              }, 3000)
            } else {
              setErrorInformation(error.response.data)
            }
          } else {
            setErrorInformation({
                status: "failed",
                message: "Cannot connect to server..."
            })
          }
        }
        setDisableButton(false)
    }

    //handler for switching what is shown, either paginated or all of the order records
    const handleSwitchPagination = () => {
      if (paginated) {
        setToggleModify(false)
        setProductRecordsShown(initialProductRecordsShown)
        setPaginated(false)
      } else {
        const arrayOfProductsInPage = initialProductRecordsShown.filter((product, index) => index < (numberOfItemsPerPage * currentPage) && index >= numberOfItemsPerPage * (currentPage - 1))
        setProductRecordsShown(arrayOfProductsInPage)
        setPaginated(true)
      }
      setChosenFilter({
        label: "",
        function: null
      })
    }

    //handler for filtering by product name or mat_description
    const handleFilterByProductName = (e) => {
        e.preventDefault()
        if (paginated) {
            const arrayOfFilteredProductName = productRecordsShown.filter((product) => {
                return product.mat_description.toLowerCase().indexOf(e.target.value.toLowerCase()) !== -1
            })
            setProductRecordsShown(arrayOfFilteredProductName)
        } else {
            const arrayOfFilteredProductName = initialProductRecordsShown.filter((product) => {
                return product.mat_description.toLowerCase().indexOf(e.target.value.toLowerCase()) !== -1
            })
            setProductRecordsShown(arrayOfFilteredProductName)
        }
    }

 //function for filtering product by product family
 const handleFilterByProductFamily = (e) => {
     e.preventDefault()
    if (paginated) {
        const arrayOfFilteredProductFamily = productRecordsShown.filter((product) => {
            return product.product_family?.toLowerCase().indexOf(e.target.value.toLowerCase()) !== -1
        })
        setProductRecordsShown(arrayOfFilteredProductFamily)
    } else {
        const arrayOfFilteredProductFamily = initialProductRecordsShown.filter((product) => {
            return product.product_family?.toLowerCase().indexOf(e.target.value.toLowerCase()) !== -1
        })
        setProductRecordsShown(arrayOfFilteredProductFamily)
    }
}


   //handler for choosing which to filter by
   const handleChooseFilterBy = (val) => {
    switch (val) {
      case "Material Description": setChosenFilter({label: "Material Description", function: handleFilterByProductName})
      break;
      case "Product Family": setChosenFilter({label: "Product Family", function: handleFilterByProductFamily})
      break;
    }
   }

    //handler for sorting based on mat_description
    const handleSortByMat_Description = () => {
      let tempArr = [...productRecordsShown]
      tempArr.sort((a, b) => {
          if(a.mat_description.trim() < b.mat_description.trim()) {
              return -1
          } 
          if(a.mat_description.trim() > b.mat_description.trim()) {
              return 1
          }
          return 0
      })
      setProductRecordsShown(tempArr)
  }

   //handler for sorting based on product family
   const handleSortByProduct_Family = () => {
    let tempArr = [...productRecordsShown]
    tempArr.sort((a, b) => {
        if(a.product_family.trim() < b.product_family.trim()) {
            return -1
        } 
        if(a.product_family.trim() > b.product_family.trim()) {
            return 1
        }
        return 0
    })
    setProductRecordsShown(tempArr)
}

   //handler for sorting based on uom
   const handleSortByUom = () => {
    let tempArr = [...productRecordsShown]
    tempArr.sort((a, b) => {
        if(a.uom < b.uom) {
            return -1
        } 
        if(a.uom > b.uom) {
            return 1
        }
        return 0
    })
    setProductRecordsShown(tempArr)
}

  //handler for sorting based on stocks
  const handleSortByStocks = () => {
    let tempArr = [...productRecordsShown]
    tempArr.sort((a, b) => {
        if(a.stocks < b.stocks) {
            return -1
        } 
        if(a.stocks > b.stocks) {
            return 1
        }
        return 0
    })
    setProductRecordsShown(tempArr)
}

    //handler for selecting products to be deleted
    const handleSelectedProducts = (e, productObject) => {
      const {checked} = e.target;
      const tempSet = new Set([...setOfProductIdsToDelete])
      if (checked) {
        tempSet.add(productObject.product_id)
      } else {
        tempSet.delete(productObject.product_id)
      }
      setSetOfProductIdsToDelete(tempSet)
    }

    //handler for deleting selected products
    const handleDeleteSelectedProducts = async (e) => {
      setDisableButton(true)
      try {
        const arrayOfProductsToDelete = [...setOfProductIdsToDelete]
        await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/form/product/selected`, {
          data: {data: arrayOfProductsToDelete},
          headers: {
              "Authorization": `Bearer ${token}`
          },
        })
        const filteredProducts = productRecordsShown.filter((product, index) => !setOfProductIdsToDelete.has(product.product_id))
        const filteredInitialProductsShown = initialProductRecordsShown.filter((product, index) => !setOfProductIdsToDelete.has(product.product_id))
        setSetOfProductIdsToDelete(new Set())
        setProductRecordsShown(filteredProducts)
        setInitialProductRecordsShown(filteredInitialProductsShown)
        handleOpenDeleteDialogue()
        clearTimeout(timeOut)
        setOpenAlert({
            status: true,
            message: "Delete Successful",
            color: "green"
          })
          timeOut = setTimeout(() => {
            setOpenAlert({
              ...openAlert,
              status: false,
              message: ""
            })
          }, 1000)
      } catch (error) {
        handleOpenDeleteDialogue()
        clearTimeout(timeOut)
        setOpenAlert({
          status: true,
          message: "Something went wrong.",
          color: "orange"
        })
        timeOut = setTimeout(() => {
          setOpenAlert({
            ...openAlert,
            status: false,
            message: ""
          })
        }, 3000)
      }
      setDisableButton(false)
    }

    //handler for editing an order
    const handleUpdateProduct = async () => {
      setDisableButton(true)
      try {
        await axios.patch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/form/product/${productToEdit.product_id}`, productToEdit, {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        })
        let updatedArrayOfProducts = [...productRecordsShown]
        let product = updatedArrayOfProducts[productToEdit.index]
        product.mat_description = productToEdit.mat_description
        product.product_family = productToEdit.product_family
        product.uom = productToEdit.uom
        product.stocks = productToEdit.stocks
        setProductRecordsShown(updatedArrayOfProducts)
        setProductToEdit({})
        setOpenEditDialogue(!openEditDialogue)
        clearTimeout(timeOut)
        setOpenAlert({
            status: true,
            message: "Update Successful",
            color: "green"
          })
          timeOut = setTimeout(() => {
            setOpenAlert({
              ...openAlert,
              status: false,
              message: ""
            })
          }, 1000)
      } catch (error) {
        if (error?.response?.data) {
          setOpenEditDialogue(!openEditDialogue)
          if (error.response.data.message === "jwt expired") {
            clearTimeout(timeOut)
            setOpenAlert({
              status: true,
              message: "Session expired, please login again",
              color: "orange"
            })
            timeOut = setTimeout(() => {
              setOpenAlert({
                ...openAlert,
                status: false,
                message: ""
              })
              Cookies.remove("jwt")
              router.replace("/auth/login")
            }, 3000)
          } else {
            setErrorInformation(error.response.data)
          }
        } else {
          setErrorInformation({
              status: "failed",
              message: "Cannot connect to server..."
          })
        }
      }
      setDisableButton(false)
    }

    //memoized function for displaying large list of orders
    const listOfProductRecords = useMemo(() => {
      return productRecordsShown.map(
        (
          {
           product_id,
           mat_code,
           mat_description,
           product_family,
           uom,
           stocks               
          },
          index,
        ) => {

          const isLast = index === productRecordsShown.length - 1;
          const classes = isLast
            ? "p-4"
            : "p-4 border-b border-blue-gray-50";

          return (
            <tr key={index}>
              <td className={classes}>
                <div className="flex items-center gap-3">
                  <Typography variant="small" color="blue-gray" className="font-normal"> {mat_code} </Typography>
                </div>
              </td>
              <td className={classes}>
                <Typography variant="small" color="blue-gray" className="font-normal"> {mat_description} </Typography>
              </td>
              <td className={classes}>
                <Typography variant="small" color="blue-gray" className="font-normal"> {product_family} </Typography>
              </td>
              <td className={classes}>
                <Typography variant="small" color="blue-gray" className="font-normal"> {uom} </Typography>
              </td>
              <td className={classes}>
                <Typography variant="small" color="blue-gray" className="font-normal"> {stocks} </Typography>
              </td>
              {toggleModify && 
                <>
                  <td>
                    <Tooltip content="Select">
                        <Checkbox color="teal" checked={setOfProductIdsToDelete.has(product_id)} onChange={(e) => handleSelectedProducts(e, {
                             product_id,
                             mat_code,
                             mat_description,
                             product_family,
                             uom,
                             stocks   
                          })} className='h-5 w-5 border border-black'></Checkbox>
                    </Tooltip>
                  </td>
                  <td className={classes} onClick={() => {
                    setOpenEditDialogue(() => !openEditDialogue)
                    setProductToEdit({
                        product_id,
                        mat_code,
                        mat_description,
                        product_family,
                        uom,
                        stocks,
                        index
                    })
                    }}>
                    <Tooltip content="Edit">
                        <IconButton variant="text">
                            <IoPencil className="h-5 w-5"/>
                        </IconButton>
                    </Tooltip>
                </td>        
                </>
              }
            </tr>
          );
        },
      )
    }, [productRecordsShown, toggleModify, setOfProductIdsToDelete, handleSelectedProducts, openEditDialogue])

    //function for the page buttons
    const getItemProps = (page) =>
    ({
      className: page === currentPage ? "bg-light font-bold" : "text-black font-bold bg-gray bg-opacity-30",
      onClick: () => {
        setCurrentPage(page)
        const arrayOfProductsInPage = initialProductRecordsShown.filter((product, index) => index < (numberOfItemsPerPage * page) && index >= numberOfItemsPerPage * (page - 1))
        setProductRecordsShown(arrayOfProductsInPage)
      },
    });
 
    const next = () => {
      if (currentPage === Math.ceil(initialProductRecordsShown.length / numberOfItemsPerPage)) return;
      const arrayOfProductsInPage = initialProductRecordsShown.filter((product, index) => index < numberOfItemsPerPage * (currentPage + 1) && index >= numberOfItemsPerPage * currentPage)
      setProductRecordsShown(arrayOfProductsInPage)
      setCurrentPage(currentPage + 1);
    };
 
    const prev = () => {
      if (currentPage <= 1) return;
      const arrayOfProductsInPage = initialProductRecordsShown.filter((product, index) => index < numberOfItemsPerPage * (currentPage - 1) && index >= numberOfItemsPerPage * (currentPage - 2))
      setProductRecordsShown(arrayOfProductsInPage)
      setCurrentPage(currentPage - 1);
    };

    //function for returning numbers of page to show in pagination
    const numberOfPagesToShow = useMemo(() => {
      const totalNumberOfPages = Math.ceil(initialProductRecordsShown.length / numberOfItemsPerPage)
      let arrayOfNumbers = []
      for (let i = 1; i <= totalNumberOfPages; i++) {
        arrayOfNumbers.push(i)
      }
      return arrayOfNumbers.map((page, index) => {
          return (
            <div key={index} className="flex items-center gap-2 mx-1">
              <IconButton {...getItemProps(page)}>{page}</IconButton>
            </div>
          )
      })
    }, [initialProductRecordsShown, currentPage, getItemProps])

    useLayoutEffect(() => {
        if (!token) return router.replace("/auth/login")
        const decodedToken = jwtDecode(token)
        if (decodedToken.role !== process.env.NEXT_PUBLIC_AUTHORIZED_ROLE && decodedToken.role !== process.env.NEXT_PUBLIC_UNAUTHORIZED_ROLE) return router.replace("/auth/login")
        if (decodedToken.role !== process.env.NEXT_PUBLIC_AUTHORIZED_ROLE) return router.replace("/form/order")
        setDecodedJWTToken(decodedToken)
        fetchAllProducts()
    },[fetchAllProducts, router, token])

  return (
    <>{errorInformation.status === "failed" || errorInformation.status === "error" ? <div className='bg-whiteSmoke m-auto w-[40%] h-[40%]'>{errorInformation.message}</div> : 
    <>{isLoading ? <ReactLoading type={"spin"} color={"#FFFFFF"} height={"10%"} width={"10%"} className="m-auto"></ReactLoading> : <>
    <Card className="h-screen w-full rounded-none">
      <CardHeader floated={false} shadow={false} className="rounded-none h-auto overflow-visible">
        <div className="mb-4 flex flex-col justify-between md:flex-row md:items-start">
          <div>
            <Typography variant="h5" color="blue-gray">
              <Button color='blue-gray' className='p-2 mr-1 rounded-full text-white' onClick={() => setOpenDrawer(true)}>
                <MdArrowForwardIos className='text-2xl'></MdArrowForwardIos>
              </Button>   
                All Products
            </Typography>
            <Typography color="gray" className="mt-1 font-normal">
              These are details about the product records
            </Typography>
          </div>
          <div className='absolute top-0 w-full flex justify-center'>
            <Alert
              open={openAlert.status}
              onClose={() => {
                clearTimeout(timeOut)
                setOpenAlert({...openAlert, status: false})
              }}
              animate={{
                mount: { y: 0 },
                unmount: { y: -100 },
              }}
              className="text-black w-auto z-20"
              color={openAlert.color}
            >
              {openAlert.message}
            </Alert>  
          </div>
          <div className='xl:flex flex-row'>
             <div className='w-full'>
                <Select
                  label="Sort By"
                  animate={{
                    mount: { y: 0 },
                    unmount: { y: 25 },
                  }}
                >
                  <Option onClick={handleSortByMat_Description}>Material Description</Option>
                  <Option onClick={handleSortByProduct_Family}>Product Family</Option>
                  <Option onClick={handleSortByUom}>UOM</Option>
                  <Option onClick={handleSortByStocks}>Stocks</Option>
                </Select>
              </div>
             <div className='w-full'>
                <Select
                  label="Filter By"
                  animate={{
                    mount: { y: 0 },
                    unmount: { y: 25 },
                  }}
                  value={chosenFilter.label}
                  onChange={handleChooseFilterBy}
                >
                  <Option value='Material Description'>Material Description :</Option>
                  <Option value='Product Family'>Product Family :</Option>
                </Select>
              </div>
              <Input type='search' label={`Type ${chosenFilter.label}`} disabled={!chosenFilter.function} onChange={chosenFilter.function}></Input>
          </div>
          <div className="flex w-full flex-wrap justify-evenly shrink-0 gap-2 md:w-[50%] lg:w-max">
            <Tooltip content="Reload">
              <IconButton variant="text">
                <AiOutlineReload className='h-6 w-6' disabled={disableButton} onClick={fetchAllProducts}></AiOutlineReload>
              </IconButton>
            </Tooltip>
            <Tooltip content="Download">
              <IconButton variant="text">
                <ReactHTMLTableToExcel
                  id="export-products-button"
                  className="text-center cursor-pointer text-black p-1 shadow-2xl m-2 rounded"
                  table="export-product-table"
                  filename="All Products"
                  sheet="Products"
                  buttonText={<AiOutlineDownload className='h-7 w-7'></AiOutlineDownload>}
                />
              </IconButton>
            </Tooltip>
            <Button color='blue-gray' className="flex items-center gap-3" size="sm" onClick={handleSwitchPagination}>
               {paginated ? "Show All" : "Paginate"}
            </Button>
            <Button color='blue-gray' className="flex items-center gap-3" size="sm" disabled={!paginated} onClick={() => setToggleModify(!toggleModify)}>
              Select
            </Button>
            <Button onClick={handleOpenDeleteDialogue} variant="gradient" color="deep-orange" disabled={setOfProductIdsToDelete.size === 0}>
              Delete
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardBody className="overflow-auto px-0 py-0">
        <table id='export-order-table' className="w-full min-w-max table-auto text-left">
          <thead>
            <tr>
              {TABLE_HEAD.map((head, index) => (
                <th
                  key={index}
                  className={`${!toggleModify && head === "" && "hidden"} border-y border-blue-gray-100 bg-blue-gray-50/50 p-4`}
                >
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal leading-none opacity-70"
                  >
                    {head}
                  </Typography>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {listOfProductRecords}
          </tbody>
        </table>
      </CardBody>
      <CardFooter className="flex items-end justify-between border-t border-blue-gray-50 p-2 md:p-6 mt-auto">
        {paginated && <>
          <Button className='my-auto' variant="outlined" size="sm" onClick={prev}>
            Previous
        </Button>
        <div className='flex overflow-auto justify-evenly w-auto mx-1 border rounded-lg py-1 border-gray'>
          {numberOfPagesToShow}
        </div>
        <Button className='my-auto' variant="outlined" size="sm" onClick={next}>
            Next
        </Button>
        </>}
      </CardFooter>
      <Dialog open={openDeleteDialogue} handler={handleOpenDeleteDialogue}>
              <DialogHeader>Are you sure you want to delete the selected record/s ?</DialogHeader>
              <DialogBody>
                Selected record/s will be permanently removed from the database.
              </DialogBody>
              <DialogFooter>
                <Button
                  variant="text"
                  color="deep-orange"
                  onClick={handleOpenDeleteDialogue}
                  className="mr-1"
                >
                  <span>Cancel</span>
                </Button>
                <Button variant="gradient" color="green" disabled={disableButton} onClick={handleDeleteSelectedProducts}>
                  <span>Confirm</span>
                </Button>
              </DialogFooter>
            </Dialog>
            <Dialog open={openEditDialogue} handler={handleOpenEditDialogue}>
              <DialogHeader>Editing...</DialogHeader>
              <DialogBody>
                <Typography className='mb-5'>Only edit inputs needed to be updated</Typography>
                <Input type='text' name='mat_description' label="Material Description" placeholder={productToEdit?.mat_description} onChange={handleSetProductToEdit}></Input>
                <Input type='text' name='product_family' label="Product Family" placeholder={productToEdit?.product_family} onChange={handleSetProductToEdit}></Input>
                <Input type='number' name='uom' label='UOM' placeholder={productToEdit?.uom} onChange={handleSetProductToEdit}></Input>
                <Input type='number' name='stocks' label='Stocks' placeholder={productToEdit?.stocks} onChange={handleSetProductToEdit}></Input>
              </DialogBody>
              <DialogFooter>
                <Button
                  variant="text"
                  color="deep-orange"
                  onClick={handleOpenEditDialogue}
                  className="mr-1"
                >
                  <span>Cancel</span>
                </Button>
                <Button variant="gradient" color="green" disabled={disableButton} onClick={handleUpdateProduct}>
                  <span>Confirm</span>
                </Button>
              </DialogFooter>
            </Dialog>
            <DrawerNav openDrawer={openDrawer} setOpenDrawer={setOpenDrawer}></DrawerNav>
    </Card>
    </>}</>
}</>
  )
}

export default ProductRecord