import React, { useState } from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";

const DynamicOffCanvas = ({ anchor, isOpen, onClose, menuItems, sendData }) => {
  const [searchValue, setSearchValue] = useState("");

  //   let filteredMenuItems = menuItems;

  //   if (
  //     menuItems &&
  //     menuItems.length > 0 &&
  //     menuItems[0].type === "allocatedUser"
  //   ) {
  //     filteredMenuItems = menuItems.filter((item) =>
  //       item.name.toLowerCase().includes(searchValue.toLowerCase())
  //     );
  //   }

  const allocatedUserCondition =
    (menuItems &&
      menuItems.length > 0 &&
      menuItems[0].type === "allocatedUser") ||
    (menuItems && menuItems.length > 0 && menuItems[0].type === "reporter");

  const filteredMenuItems = allocatedUserCondition
    ? menuItems.filter((item) =>
        item.name.toLowerCase().includes(searchValue.toLowerCase())
      )
    : menuItems;

  return (
    <Drawer anchor={anchor} open={isOpen} onClose={onClose}>
      {allocatedUserCondition ? (
        <label className="input input-bordered flex items-center gap-2">
          <input
            type="text"
            className="grow"
            placeholder="Search"
            value={searchValue}
            onChange={(e) => {
              console.log(e.target.value);
              setSearchValue(e.target.value);
            }}
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="w-4 h-4 opacity-70"
          >
            <path
              fillRule="evenodd"
              d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
              clipRule="evenodd"
            />
          </svg>
        </label>
      ) : (
        ""
      )}
      <Box
        sx={{ width: anchor === "bottom" ? "auto" : 250 }}
        role="presentation"
        onClick={onClose}
        onKeyDown={onClose}
      >
        <List
          className={allocatedUserCondition ? "h-[300px] overflow-auto" : ""}
        >
          {filteredMenuItems.map((menuItem, index) => (
            <ListItem key={index} disablePadding>
              <ListItemButton onClick={() => sendData(menuItem)}>
                <ListItemIcon>
                  {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                </ListItemIcon>
                <ListItemText primary={menuItem.name} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
      </Box>
    </Drawer>
  );
};

export default DynamicOffCanvas;
