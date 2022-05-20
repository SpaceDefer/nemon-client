import React, { useState } from "react";
import { Box, IconButton, Tooltip } from "@mui/material";
import EventNoteIcon from "@mui/icons-material/EventNote";
import Modal from "@mui/material/Modal";
import { log } from "../logger";

const Log = () => {
    const [open, setOpen] = useState<boolean>(false);

    const handleLogOpen = () => {
        setOpen(true);
    };

    const handleLogClose = () => {
        setOpen(false);
    };

    return (
        <>
            <Tooltip title="Open Log">
                <IconButton
                    style={{
                        position: "absolute",
                        zIndex: "1000",
                        right: "5vw",
                        top: "5vh",
                    }}
                    onClick={handleLogOpen}
                >
                    <EventNoteIcon />
                </IconButton>
            </Tooltip>

            <Modal open={open} onClose={handleLogClose}>
                <Box
                    style={{
                        position: "absolute",
                        minHeight: "60vh",
                        minWidth: "60vw",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        backgroundColor: "white",
                    }}
                >
                    {log}
                </Box>
            </Modal>
        </>
    );
};

export default Log;
