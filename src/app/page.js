'use client';

import { useState, useEffect } from 'react';
import { Box, Stack, Typography, Button, Modal, TextField, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, InputBase, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { firestore } from './firebase';
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  deleteDoc,
  getDoc,
} from 'firebase/firestore';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: 3,
};

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({ name: doc.id, ...doc.data() });
    });
    setInventory(inventoryList);
  };

  useEffect(() => {
    updateInventory();
  }, []);

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 });
    } else {
      await setDoc(docRef, { quantity: 1 });
    }
    await updateInventory();
  };

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
    }
    await updateInventory();
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const filteredInventory = inventory.filter(({ name }) =>
    name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="flex-start"
      alignItems="center"
      bgcolor="#f5f5f5"
      p={4}
    >
      <Typography variant="h2" color="#333" textAlign="center" mb={4}>
        Inventory Items
      </Typography>

      <Box width="80%" maxWidth={1200}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Paper
            component="form"
            sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 400 }}
          >
            <InputBase
              sx={{ ml: 1, flex: 1 }}
              placeholder="Search Items"
              inputProps={{ 'aria-label': 'search items' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
              <SearchIcon />
            </IconButton>
          </Paper>
          <Button variant="contained" onClick={handleOpen} sx={{ fontSize: '1.2rem', py: 2, px: 4 }}>
            Add New Item
          </Button>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredInventory.map(({ name, quantity }) => (
                <TableRow key={name}>
                  <TableCell>{name.charAt(0).toUpperCase() + name.slice(1)}</TableCell>
                  <TableCell>{quantity}</TableCell>
                  <TableCell>
                    <Button variant="contained" onClick={() => removeItem(name)}>
                      Remove
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Add Item
          </Typography>
          <Stack direction="row" spacing={2}>
            <TextField
              id="outlined-basic"
              label="Item"
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <Button
              variant="contained"
              onClick={() => {
                addItem(itemName);
                setItemName('');
                handleClose();
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>
    </Box>
  );
}
