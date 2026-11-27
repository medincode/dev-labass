import { AnimatePresence, motion } from 'framer-motion'
import Icon3D from './Icon3D'

type P = { open: boolean; title: string; text: string; icon?: string; confirm?: string; onConfirm: () => void; onCancel: () => void }
/** Boîte de dialogue maison (remplace window.confirm) : glass + spring. */
export default function Confirm({ open, title, text, icon = 'flame', confirm = 'Confirmer', onConfirm, onCancel }: P) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div className="modal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onCancel}>
          <motion.div className="dialog glass" role="alertdialog" aria-modal onClick={e => e.stopPropagation()}
            initial={{ scale: .8, y: 30, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: .9, opacity: 0 }} transition={{ type: 'spring', stiffness: 340, damping: 22 }}>
            <Icon3D name={icon} size={84} float />
            <h3>{title}</h3>
            <p>{text}</p>
            <div className="actions">
              <motion.button className="pill ghost" whileHover={{ scale: 1.04 }} whileTap={{ scale: .92 }} onClick={onCancel}>Annuler</motion.button>
              <motion.button className="pill danger" whileHover={{ scale: 1.04 }} whileTap={{ scale: .92 }} onClick={onConfirm}>{confirm}</motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
