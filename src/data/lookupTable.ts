export const getTaxLookupTableA = async (): Promise<[number, number, number][]> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([
        [0, 0, 54167],
        [135417, 0.4, 0],
        [150000, 0.3, 15000],
        [300000, 0.2, 45000],
        [550000, 0.1, 100000],
        [833334, 0.05, 141667]
      ]);
    }, 100); 
  });
};

export const getTaxLookupTableB = async (): Promise<[number, number, number][]> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([
        [0, 0.05105, 0],
        [162501, 0.10210, 8296],
        [275001, 0.20420, 36374],
        [375001, 0.36693, 54113],
        [1500000, 0.4084, 237893]
      ]);
    }, 100); // Simulate network latency
  });
};