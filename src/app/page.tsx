"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button, Typography } from "@mui/material";
import { styled, alpha } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Container } from "@mui/material";
import InputBase from "@mui/material/InputBase";
import { useRef } from "react";
import { toaster } from "@/shared/utils/toastify";
import CustomToaster from "@/shared/components/CustomToaster";
import "react-toastify/dist/ReactToastify.css";
import { Navbar } from "@/shared/components/Navbar";
import { axiosInstance } from "@/shared/services/axiosInstance";
import axios, { AxiosResponse } from "axios";
import loading from "./loading.gif";
interface Task {
  id: number;
  title: string;
  description: string;
  duedate: string;
  status: string;
  priority: string;
}
export default function Home() {
  const [allTask, setallTask] = useState<Task[]>([]);
  const router = useRouter();
  const [flagforincomingtask, setflagforincomingtask] =
    useState<boolean>(false);
  const [message, setmessage] = useState<string>("Loading...");
  const [removetaskFlag, setremovetaskflag] = useState<boolean>(false);
  const [deletedtaskId, setdeletedtaskId] = useState<number>();
  const search = useRef<HTMLInputElement>();
  useEffect(() => {
    const fetchApi = async () => {
      try {
        const response = await axiosInstance.get("/task/get");
        if (response.data.tasks.length === 0) {
          setmessage("No Task found ");
          return;
        }

        setallTask(response.data.tasks);
        setflagforincomingtask(true);
      } catch (e: any) {
        if (e.message === "Network Error") {
          setmessage("Network Error");
          return;
        }
        if (e.response.status === 404) {
          setmessage(e.response.data.error);
          return;
        }

        if (e.response.status === 500) {
          setmessage("Internal server error");
        }
      }
    };
    fetchApi();
  }, []);

  const Search = styled("div")(({ theme }) => ({
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(1),
      width: "auto",
    },
  }));

  const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: "inherit",
    "& .MuiInputBase-input": {
      padding: theme.spacing(1, 1, 1, 0),
      paddingLeft: `calc(1em + ${theme.spacing(0)})`,
      width: "100%",
      [theme.breakpoints.up("sm")]: {
        width: "20ch",
        "&:focus": {
          width: "20ch", // Keep the width fixed when focused
        },
      },
    },
    // Remove the transition property
    transition: "none",
  }));

  const removetask = async (id: number) => {
    setdeletedtaskId(id);
    try {
      const result: AxiosResponse<any, any> = await axiosInstance.delete(
        `/task/delete/${id}`
      );

      if (result.status === 200) {
        const tasksExceptDeleted = allTask.filter(
          (task: Task) => task.id !== id
        );
        setallTask([...tasksExceptDeleted]);
        toaster.success("Delete Successfully!!!");
        if (tasksExceptDeleted.length === 0) {
          setflagforincomingtask(false);
          setmessage("No Task found!!!");
        }
      }
    } catch (e: any) {
      if (e.message === "Network Error")
        toaster.error("Network error please try again");
      else toaster.error(e.response.data.error);
    }
    setdeletedtaskId(0);
  };

  const taskSearch = () => {
    const value = search.current?.value;
    if (value === "") {
      return toaster.error("Type something!!!");
    }

    const searchedtask = allTask.filter((task: any) =>
      task.title.toLowerCase().match(value?.toLowerCase())
    );
    if (searchedtask.length === 0) {
      toaster.error("No task found!!!");
    } else {
      toaster.success(`${searchedtask.length} Task Found`);
      setallTask([...searchedtask]);
    }
  };

  return (
    <>
      <Navbar></Navbar>
      <h3 className="text-center">Welcome To Task Manager</h3>
      <br />
      <Container
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>
          <Search>
            <Button onClick={taskSearch}>
              <img
                width="20"
                height="20"
                src="https://img.icons8.com/ios/20/search--v1.png"
                alt="search--v1"
              />
            </Button>

            <StyledInputBase
              placeholder="Search…"
              inputProps={{ "aria-label": "search" }}
              inputRef={search}
              sx={{ border: "1px solid black", borderRadius: "4px" }} // Add this line
            />
          </Search>
        </div>
        <Button
          onClick={() => {
            router.push("/task/add");
          }}
          variant="outlined"
        >
          Add Task
        </Button>
      </Container>
      <br />
      <br />

      <Container>
        {flagforincomingtask ? (
          <TableContainer component={Paper}>
            <Table aria-label="caption table">
              <TableHead>
                <TableRow>
                  <TableCell>TaskId</TableCell>
                  <TableCell align="left">Title</TableCell>
                  <TableCell align="left">Description</TableCell>
                  <TableCell align="left" style={{ minWidth: 110 }}>
                    Duedate
                  </TableCell>
                  <TableCell align="left">Status</TableCell>
                  <TableCell align="left">Priority</TableCell>
                  <TableCell align="right" style={{ minWidth: 100 }}>
                    Action(s)
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {allTask.map((task: Task) => (
                  <TableRow key={task.id}>
                    <TableCell component="th" scope="row">
                      {task.id}
                    </TableCell>
                    <TableCell align="left">{task.title}</TableCell>
                    <TableCell align="left">{task.description}</TableCell>
                    <TableCell align="left">{task.duedate}</TableCell>
                    <TableCell align="left">{task.status}</TableCell>
                    <TableCell align="left">{task.priority}</TableCell>
                    <TableCell align="right">
                      {deletedtaskId === task.id ? (
                        <span>Deleting...</span>
                      ) : (
                        <img
                          style={{ float: "left" }}
                          onClick={() => {
                            removetask(task.id);
                          }}
                          height="25"
                          width="25"
                          src="https://img.icons8.com/fluency/25/filled-trash.png"
                          alt="filled-trash"
                        />
                      )}
                      <img
                        style={{ float: "right" }}
                        onClick={() => {
                          router.push(`/task/edit/${task.id}`);
                        }}
                        height="25"
                        width="25"
                        src="https://img.icons8.com/color/25/edit--v1.png"
                        alt="edit--v1"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography>{message}</Typography>
        )}
      </Container>
      <CustomToaster />
    </>
  );
}
