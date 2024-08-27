import PropTypes from 'prop-types';
import { Paper, Typography } from '@mui/material';

SearchNotFound.propTypes = {
  searchQuery: PropTypes.string
};

export default function SearchNotFound({ searchQuery = '', ...other }) {
  return (
    <Paper {...other}>
      <Typography gutterBottom align="center" variant="subtitle1">
        No data
      </Typography>
    </Paper>
  );
}
