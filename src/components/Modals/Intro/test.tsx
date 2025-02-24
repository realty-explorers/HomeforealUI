//
// import { useState } from 'react';
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   Checkbox,
//   FormControlLabel,
//   Typography,
//   Box,
//   Divider
// } from '@mui/material';
// import { CheckCircle, ArrowForward } from '@mui/icons-material';
//
// const IntroDialog = ({ show, setShow }) => {
//   const [acceptedTOS, setAcceptedTOS] = useState(false);
//   const [kycStarted, setKycStarted] = useState(false);
//
//   return (
//     <Dialog
//       open={show}
//       onClose={() => setShow(false)}
//       PaperProps={{
//         className:
//           'backdrop-blur-lg bg-opacity-90 bg-gradient-to-br from-[#590d82] via-[#7634a8] to-[#9b51e0]',
//         sx: { borderRadius: 4 }
//       }}
//     >
//       <DialogTitle className="text-white">
//         <div className="flex items-center gap-4">
//           <span className="text-4xl">🏠</span>
//           <h2 className="text-2xl font-bold">Welcome to EstateFlow! 🎉</h2>
//         </div>
//       </DialogTitle>
//
//       <DialogContent className="!pt-4 space-y-6">
//         <Typography variant="body1" className="!text-white !mb-6">
//           Let's transform your property journey! We'll guide you through:
//         </Typography>
//
//         <div className="space-y-4 text-white">
//           {[
//             '1. Verify your identity',
//             '2. Accept our friendly terms',
//             '3. Start managing properties'
//           ].map((text) => (
//             <div key={text} className="flex items-center gap-3">
//               <CheckCircle className="text-[#9b51e0]" />
//               <span className="text-lg">{text}</span>
//             </div>
//           ))}
//         </div>
//
//         <Divider className="!my-6 !bg-white/20" />
//
//         <FormControlLabel
//           control={
//             <Checkbox
//               checked={acceptedTOS}
//               onChange={(e) => setAcceptedTOS(e.target.checked)}
//               className="!text-white"
//             />
//           }
//           label={
//             <span className="text-white">
//               I agree to the{' '}
//               <a href="/terms" className="underline text-[#9b51e0]">
//                 Terms of Service
//               </a>{' '}
//               and confirm I'm at least 18 years old 🎂
//             </span>
//           }
//         />
//       </DialogContent>
//
//       <DialogActions className="!px-6 !pb-6">
//         <Button
//           variant="contained"
//           endIcon={<ArrowForward />}
//           className="!rounded-full !px-8 !py-3"
//           disabled={!acceptedTOS}
//           style={{
//             backgroundColor: acceptedTOS ? '#9b51e0' : '#cccccc',
//             color: acceptedTOS ? 'white' : '#666666'
//           }}
//           onClick={() => {
//             // Initiate KYC flow
//             setKycStarted(true);
//           }}
//         >
//           Start Secure Verification 🔒
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// };
//
// export default IntroDialog;
