// SetKeyDialog.js
import React from 'react';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

export default function SetKeyDialog({ open, onClose, onSetKey }) {
  const [key, setKey] = React.useState('');

  const handleClose = () => {
    onClose();
    setKey('');
  };

  const handleSetKey = () => {
    onSetKey(key);
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Set Key</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="key"
          label="Key"
          type="text"
          fullWidth
          value={key}
          onChange={(e) => setKey(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSetKey} color="primary">
          Set Key
        </Button>
      </DialogActions>
    </Dialog>
  );
}

SetKeyDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSetKey: PropTypes.func.isRequired,
};
