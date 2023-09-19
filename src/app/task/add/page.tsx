"use client";
import {
  Button,
  TextField,
  Container,
  Typography,
  CssBaseline,
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
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { toaster } from "@/shared/utils/toastify";
import "react-toastify/dist/ReactToastify.css";
import CustomToaster from "@/shared/components/CustomToaster";
import { axiosInstance } from "@/shared/services/axiosInstance";
import { useState } from "react";
import axios from "axios";
const defaultTheme = createTheme();
interface AddForm {
  id: string;
  title: string;
  description: string;
  duedate: string;
  priority: string;
}

const Add: React.FC= () => {
  const [uuid] = useState(uuidv4());
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm({
    resolver: yupResolver(validation.schemaforAddTaskandEditTask),
  });

  const router = useRouter();

  const onSubmit = async (data: AddForm) => {
    try {
      await axiosInstance.post("/task/add", data);
      toaster.success("Task Added");
      setTimeout(() => {
        router.push("/");
      }, 1000);
    } catch (e: any) {
      if (e.message === "Network Error") {
        return toaster.error("Network error please try again");
      } else {
        toaster.error("internal server error");
      }
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography component="h1" variant="h5">
            Add Task
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
                  value={uuid}
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
                    defaultValue="Low"
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
              Add
            </Button>
          </form>
        </div>
      </Container>
      <CustomToaster />
    </ThemeProvider>
  );
};

export default Add;
