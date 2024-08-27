import { useEffect, useState, useRef } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CircularProgress,
  Container,
  InputAdornment,
  OutlinedInput,
  Stack,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TableSortLabel
} from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import { experimentalStyled as styled } from '@mui/material/styles';
import usePagination from '../../common/hooks/usePagination';
import Scrollbar from '../../components/Scrollbar';
import SearchNotFound from '../../components/SearchNotFound';
import { toast } from 'react-toastify';
import CustomPagination from '../../components/common/CustomPagination';
import DeleteModal from '../../components/common/DeleteModal';
import { get, patch } from '../../common/client/fetchApi';

const TABLE_HEAD = [
  { id: 'id', label: '#', alignRight: false },
  { id: 'operation', label: 'Operation', alignRight: false },
  { id: 'amount', label: 'Amount', alignRight: false },
  { id: 'userBalance', label: 'Balance', alignRight: false },
  { id: 'operationResponse', label: 'Operation Response', alignRight: false },
  { id: 'date', label: 'Date', alignRight: false },
  { id: '' }
];

const SearchStyle = styled(OutlinedInput)(({ theme }) => ({
  width: 240,
  transition: theme.transitions.create(['box-shadow', 'width'], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter
  }),
  '&.Mui-focused': { width: 320 },
  '& fieldset': {
    borderWidth: `1px !important`,
    borderColor: `${theme.palette.grey[500_32]} !important`
  }
}))

export default function RecordList() {
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [recordsPagination, setRecordsPagination] = useState(null);
  const [records, setRecords] = useState([]);
  const [deleteRecordId, setDeleteRecordId] = useState(null);
  const timerRef = useRef(null);

  const fetchAllRecords = async (config = paginationConfig) => {
    const { limit, term, sortField, sortOrder } = config;
    const page = config.page - 1;
    const response = await get(`/operations/records?page=${page}&size=${limit}&term=${term}&sortBy=${sortField}&sortDirection=${sortOrder}`);

    if (response) {
      const data = await response.json();
      setRecordsPagination(data);
    }

    setLoading(false);
  };

  const { run, jump, sort, toLimit, search, paginationConfig, setPaginationOptions } = usePagination(fetchAllRecords);

  useEffect(() => {
    run();
    setLoading(true);
  }, []);

  useEffect(() => {
    if (recordsPagination) {
      setRecords(recordsPagination.content);
      setPaginationOptions({pages: recordsPagination.totalPages, total: recordsPagination.totalElements});
    }
  }, [recordsPagination]);

  const handleRequestSort = (property) => {
    const isAsc = paginationConfig.sortField === property && paginationConfig.sortOrder === 'asc';
    const or = isAsc ? 'desc' : 'asc';
    sort({sortField: property, sortOrder: or});
    setLoading(true);
  };

  const handleChangePage = (event, newPage) => {
    event.preventDefault();
    jump(newPage);
    setLoading(true);
  };

  const handleChangeRowsPerPage = (event) => {
    const newRpp = parseInt(event.target.value, 10);
    toLimit(newRpp);
    setLoading(true);
  };

  const handleSearch = (event) => {
    setPaginationOptions({page: 1, term: event.target.value});
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      setLoading(true);
      search(event.target.value);
    }, 1500);
  };

  const handleOpenModalDeleteRecord = async (id) => {
    setDeleteRecordId(id);
    setShowDeleteModal(true);    
  };

  const handleDeleteRecord = async () => {
    setShowDeleteModal(false);
    const response = await patch(`/operations/records/${deleteRecordId}`);

    if (response && response.status === 200) {
      toast.success('Record deleted successfully');
      setLoading(true);
      run();
    }
    
  };

  return (
    <Container>
      {showDeleteModal && <DeleteModal onCancel={() => setShowDeleteModal(false)} onSubmit={handleDeleteRecord} />}
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
      <SearchStyle
        value={paginationConfig.term}
        onChange={handleSearch}
        placeholder="Search..."
        startAdornment={
          <InputAdornment position="start">
            <Box sx={{ color: 'text.disabled' }} />
          </InputAdornment>
        }
      />

        <Button
          color={'secondary'}
          variant="contained"
          component={RouterLink}
          to="/operation/execute-operation"
        >
          Execute New Operation
        </Button>
      </Stack>

      {loading && <Stack direction="row" alignItems="center" justifyContent="center" my={'25%'}><CircularProgress /></Stack>}
      {!loading && 
        <>
          {recordsPagination && records && records.length > 0 && 
            <Card>
              <CustomPagination 
                onChangePage={handleChangePage} 
                onChangeLimit={handleChangeRowsPerPage} 
                paginationConfig={paginationConfig} 
              />

              <Scrollbar>
                <TableContainer sx={{ minWidth: 1000 }}>
                  <Table>
                    <TableHead key={'TableHead'}>
                      <TableRow key={'TableHeadRow'}>
                        {TABLE_HEAD.map((headCell) => (
                          <TableCell
                            key={headCell.id}
                            align={headCell.alignRight ? 'right' : 'left'}
                            sortDirection={paginationConfig.sortField === headCell.id ? paginationConfig.sortOrder : false}
                          >
                            <TableSortLabel
                              hideSortIcon
                              active={paginationConfig.sortField === headCell.id}
                              direction={paginationConfig.sortField === headCell.id ? paginationConfig.sortOrder : 'asc'}
                              onClick={(e) => handleRequestSort(headCell.id)}
                            >
                              {headCell.label}
                              {paginationConfig.sortField === headCell.id ? (
                                <Box sx={{ ...visuallyHidden }}>
                                  {paginationConfig.sortOrder === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </Box>
                              ) : null}
                            </TableSortLabel>
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {records.map((row) => {
                          return (
                            <TableRow
                              hover
                              key={row.id}
                              tabIndex={-1}
                            >
                              <TableCell align="left">{row.id}</TableCell>
                              <TableCell align="left">{row.operationType}</TableCell>
                              <TableCell align="left">{row.amount}</TableCell>
                              <TableCell align="left">{row.userBalance}</TableCell>
                              <TableCell align="left">{row.operationResponse}</TableCell>
                              <TableCell align="left">{row.date}</TableCell>
                              <TableCell align="right"><Button onClick={() => handleOpenModalDeleteRecord(row.id)}>Delete</Button></TableCell>
                            </TableRow>
                          );
                        })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Scrollbar>
            </Card>
          }

          {recordsPagination && records && records.length === 0 && (
            <SearchNotFound searchQuery={paginationConfig.term} />
          )}
        </>
      }
    </Container>
  );
}
