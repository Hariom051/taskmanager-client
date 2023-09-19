"use client";
import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import { Divider } from "@mui/material";
import { useSession, signOut } from "next-auth/react";
import Menu from "@mui/material/Menu";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import LogoutIcon from "@mui/icons-material/Logout";
import { axiosInstance } from "../services/axiosInstance";
import { toaster } from "../utils/toastify";
import {useRouter} from "next/navigation";
export const Navbar = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [flagfordisabled,setflagfordisabled]=React.useState<boolean>(false)
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  console.log(session)
  const signout=async()=>{
    setflagfordisabled(true)
    try{
      toaster.success("Logout Successful")
      await signOut({ callbackUrl: "/login", redirect: true });
    }
    catch(e){
    toaster.error("Internal server error");
    }
    setflagfordisabled(false)
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
            Task Manager
          </Typography>
          {/* // if there is session then show icon else null fragment */}
          {session ? (
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar
                    alt={`${session.user?.name}`}
                    src={`${session.user?.image}`}
                  />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                <MenuItem>
                  <Typography textAlign="center">
                    {session.user?.email}
                  </Typography>
                </MenuItem>
                <MenuItem>
                  <Typography textAlign="center">
                    {session.user?.name}
                  </Typography>
                </MenuItem>
                <Divider />
                <MenuItem  disabled={flagfordisabled}
                  onClick={signout}
                >
                  <Typography textAlign="center">
                    <LogoutIcon /> &nbsp; Logout
                  </Typography>
                </MenuItem>
              </Menu>
            </Box>
          ) : (
            <></>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
};
