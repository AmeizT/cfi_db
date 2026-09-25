import { WorkspaceEngagementView } from "@/features/workspace/views/WorkspaceEngagementView"

export default function Page() { 
    return <WorkspaceEngagementView page="activities" />
}








// import {
//     AnimatePresence,
//     motion,
//     useReducedMotion,
// } from "motion/react"

// export function ExpandingCard() {
//     const [expanded, setExpanded] = React.useState(false)
//     const reduceMotion = useReducedMotion()

//     return (
//         <motion.div
//             layout
//             onClick={() => setExpanded((value) => !value)}
//             className="
//                 relative
//                 cursor-pointer
//                 overflow-hidden
//                 bg-zinc-100
//                 border-0
//                 shadow-none
//             "
//             animate={{
//                 width: expanded ? 520 : 220,
//                 height: expanded ? 320 : 52,
//                 borderRadius: expanded ? 24 : 999,
//             }}
//             transition={
//                 reduceMotion
//                     ? { duration: 0 }
//                     : {
//                           layout: {
//                               type: "spring",
//                               stiffness: 420,
//                               damping: 36,
//                               mass: 0.8,
//                           },
//                           width: {
//                               type: "spring",
//                               stiffness: 420,
//                               damping: 36,
//                           },
//                           height: {
//                               type: "spring",
//                               stiffness: 420,
//                               damping: 36,
//                           },
//                           borderRadius: {
//                               duration: 0.25,
//                               ease: [0.22, 1, 0.36, 1],
//                           },
//                       }
//             }
//         >
//             <AnimatePresence
//                 initial={false}
//                 mode="popLayout"
//             >
//                 {!expanded ? (
//                     <motion.div
//                         key="collapsed"
//                         className="absolute inset-0 flex items-center justify-center"
//                         initial={{
//                             opacity: 0,
//                             filter: "blur(6px)",
//                             scale: 0.96,
//                         }}
//                         animate={{
//                             opacity: 1,
//                             filter: "blur(0px)",
//                             scale: 1,
//                         }}
//                         exit={{
//                             opacity: 0,
//                             filter: "blur(8px)",
//                             scale: 0.96,
//                         }}
//                         transition={{
//                             duration: 0.18,
//                             ease: "easeOut",
//                         }}
//                     >
//                         <span className="text-sm font-medium">
//                             Pay $24.00
//                         </span>
//                     </motion.div>
//                 ) : (
//                     <motion.div
//                         key="expanded"
//                         className="absolute inset-0 p-6"
//                         initial={{
//                             opacity: 0,
//                             filter: "blur(10px)",
//                             scale: 0.97,
//                         }}
//                         animate={{
//                             opacity: 1,
//                             filter: "blur(0px)",
//                             scale: 1,
//                         }}
//                         exit={{
//                             opacity: 0,
//                             filter: "blur(8px)",
//                             scale: 0.98,
//                         }}
//                         transition={{
//                             duration: 0.24,
//                             delay: 0.07,
//                             ease: [0.22, 1, 0.36, 1],
//                         }}
//                     >
//                         <ExpandedContent />
//                     </motion.div>
//                 )}
//             </AnimatePresence>
//         </motion.div>
//     )
// }

// function ExpandedContent() {
//     return (
//         <div className="space-y-5">
//             <div>
//                 <p className="text-sm text-muted-foreground">
//                     Payment
//                 </p>

//                 <h2 className="mt-1 text-xl font-semibold">
//                     Complete payment
//                 </h2>
//             </div>


            

            

//             <div className="rounded-xl bg-muted p-4">
//                 Order total
//                 <span className="float-right font-semibold">
//                     $24.00
//                 </span>
//             </div>

//             <button
//     className="
//         active-glass
//         relative
//         flex h-11 w-full
//         items-center gap-3
//         px-4
//         text-sm font-medium
//     "
// >
    

//     <span className="relative z-10">
//         Continue
//     </span>
// </button>
//         </div>
//     )
// }





