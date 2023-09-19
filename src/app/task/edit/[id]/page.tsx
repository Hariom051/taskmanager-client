"use client";
import {
  Button,
  TextField,
  Container,
  Typography,
  Grid,
  FormControl,
  FormHelperText,
  Select,
  MenuItem,
  InputLabel,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useForm } from "react-hook-form";
import { validation } from "@/validation/validation";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toaster } from "@/shared/utils/toastify";
import CustomToaster from "@/shared/components/CustomToaster";
import "react-toastify/dist/ReactToastify.css";
import { yupResolver } from "@hookform/resolvers/yup";
import { axiosInstance } from "@/shared/services/axiosInstance";
const defaultTheme = createTheme();

interface EditForm {
  id: string;
  title: string;
  description: string;
  duedate: string;
  priority: string;
}


const EditTask= ({ params }: any) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    setValue,
  } = useForm({
    resolver: yupResolver(validation.schemaforAddTaskandEditTask),
  });
  const router = useRouter();
  const { id } = params;
  const [isExistTask, setisExistTask] = useState<boolean>(false);

  const [defaultValueForselect, setdefaultValueForselect] =
    useState<string>("");
  useEffect(() => {
    const fetchApi = async () => {
      try {
        const result = await axiosInstance.get(`/task/get/${id}`);
        setisExistTask(true);
        setValue("id", result.data.task.id);
        setValue("title", result.data.task.title);
        setValue("description", result.data.task.description);
        setValue("duedate", result.data.task.duedate);
        setdefaultValueForselect(result.data.task.priority);
      } catch (e: any) {
        if (e.message === "Network Error") {
          toaster.error("Network error please try again");
          router.push("/");
          return;
        }

        setisExistTask(false);
        toaster.error(e.response.data.error);
        router.push("/");
      }
    };

    fetchApi();
  }, []);

  const onSubmit = async (data: EditForm) => {
    try {
      await axiosInstance.put(`/task/update/${data.id}`, data);
      toaster.success("Edit Successfully!!!");
      setTimeout(() => {
        router.push("/");
      }, 1000);
    } catch (e: any) {
      if (e.message === "Network Error")
        toaster.error("Network error please try again");
      else toaster.error(e.response.data.error);
    }
  };

  return (
    <>
      {isExistTask ? (
        <ThemeProvider theme={defaultTheme}>
          <Container component="main" maxWidth="xs">
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Typography component="h1" variant="h5">
                Edit Task
              </Typography>
              <form
                onSubmit={handleSubmit(onSubmit)}
                style={{ width: "100%", marginTop: 1 }}
              >
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      {...register("id")}
                      fullWidth
                      label="ID"
                      id="id"
                      type="text"
                      value={id}
                      error={!!errors.id}
                      helperText={errors.id?.message || ""}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      {...register("title")}
                      fullWidth
                      label="Title"
                      id="title"
                      type="text"
                      error={!!errors.title}
                      helperText={errors.title?.message || ""}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      {...register("description")}
                      fullWidth
                      label="Description"
                      id="description"
                      type="text"
                      error={!!errors.description}
                      helperText={errors.description?.message || ""}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      {...register("duedate")}
                      fullWidth
                      label="Due Date"
                      id="duedate"
                      type="date"
                      InputLabelProps={{
                        shrink: true, // This will move the label up when the input has content
                      }}
                      error={!!errors.duedate}
                      helperText={errors.duedate?.message || ""}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel htmlFor="priority">Priority</InputLabel>
                      <Select
                        {...register("priority")}
                        label="Priority"
                        id="priority"
                        value={defaultValueForselect}
                        onChange={(event) => {
                          setdefaultValueForselect(event.target.value);
                        }}
                        error={!!errors.priority}
                      >
                        <MenuItem value="Low">Low</MenuItem>
                        <MenuItem value="Medium">Medium</MenuItem>
                        <MenuItem value="High">High</MenuItem>
                      </Select>
                      <FormHelperText>
                        {errors.priority?.message || ""}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                </Grid>
                <Button
                  disabled={isSubmitting || !isValid}
                  type="submit"
                  fullWidth
                  variant="outlined"
                  color="primary"
                  style={{ marginTop: "16px" }}
                >
                  Edit
                </Button>
              </form>
            </div>
          </Container>
        </ThemeProvider>
      ) : (
        <Typography>Loading...</Typography>
      )}
      <CustomToaster />
    </>
  );
};

export default EditTask;
