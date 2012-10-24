"use strict";

var flags = process.binding("constants")

var O_EXCL = flags.O_EXCL
var FLAGS = {
  "r"   :     flags.O_RDONLY,
  "rs"  :     flags.O_RDONLY | flags.O_SYNC,
  "r+"  :     flags.O_RDWR,
  "rs+" :     flags.O_RDWR | flags.O_SYNC,

  "w"   :     flags.O_TRUNC | flags.O_CREAT | flags.O_WRONLY,
  "wx"  :     flags.O_TRUNC | flags.O_CREAT | flags.O_WRONLY | flags.O_EXCL,
  "xw"  :     flags.O_TRUNC | flags.O_CREAT | flags.O_WRONLY | flags.O_EXCL,

  "w+"  :     flags.O_TRUNC | flags.O_CREAT | flags.O_RDWR,
  "wx+" :     flags.O_TRUNC | flags.O_CREAT | flags.O_RDWR,
  "xw+" :     flags.O_TRUNC | flags.O_CREAT | flags.O_RDWR | flags.O_EXCL,

  "a"   :     flags.O_APPEND | flags.O_CREAT | flags.O_WRONLY,
  "ax"  :     flags.O_APPEND | flags.O_CREAT | flags.O_WRONLY,
  "xa"  :     flags.O_APPEND | flags.O_CREAT | flags.O_WRONLY | flags.O_EXCL,

  "a+"  :     flags.O_APPEND | flags.O_CREAT | flags.O_RDWR,
  "ax+" :     flags.O_APPEND | flags.O_CREAT | flags.O_RDWR | flags.O_EXCL,
  "xa+" :     flags.O_APPEND | flags.O_CREAT | flags.O_RDWR | flags.O_EXCL
}

function Exception(code, syscall) {
  var error = Error(syscall + " " + code);
  error.errno = error.code = code;
  error.syscall = syscall;
  return error;
}

function makeFlags(flag) {
  // Only mess with strings
  if (typeof(flag) !== "string") return flag;

  // O_EXCL is mandated by POSIX, Windows supports it too.
  // Let's add a check anyway, just in case.
  if (!O_EXCL && ~flag.indexOf("x"))
    throw Exception("ENOSYS", "fs.open(O_EXCL)")

  if (flag in FLAGS) return FLAGS[flag]

  throw new Error("Unknown file open flag: " + flag)
}
makeFlags.flags = FLAGS

module.exports = makeFlags
