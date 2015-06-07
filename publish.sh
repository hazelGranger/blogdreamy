#!/bin/bash
currentBranchName=`git rev-parse --abbrev-ref HEAD`
if [ $currentBranchName != "publish_branch" ] ; then
  echo "branch must be publish_branch"
  exit 0
fi


git fetch origin master
git merge FETCH_HEAD
npm install
REMOTE_SSHURI="deploy@119.29.58.96"
REMOTE_BUILD_PATH="/oneapm/local/tengine-2.0.3/html/"
# REMOTE_BUILD_PATH="/var/www/oneapmstatic/assets/html/"
REMOTE_STATIC_PATH="/var/www/oneapmstatic/assets/sites2"
STATIC_FILES="fonts/ images/ scripts/ styles/ ./*.png ./*.ico"
STATIC_ZIPNAME="oneapmcomstatic.zip"
BUILD_ZIPNAME="oneapmcombuild.zip"
TMPDIR="../.tmp"

grunt dist
rc=$?
if [ $rc = 0 ] ; then
  cd dist/
  zip -r ${TMPDIR}/${STATIC_ZIPNAME} ${STATIC_FILES}
  zip -r ${TMPDIR}/${BUILD_ZIPNAME} ./*

  # cp ${TMPDIR}/${STATIC_ZIPNAME} ${REMOTE_STATIC_PATH}
  # unzip -oq ${REMOTE_STATIC_PATH}/${STATIC_ZIPNAME} -d ${REMOTE_STATIC_PATH}
  scp -P 20001 ${TMPDIR}/${STATIC_ZIPNAME} ${REMOTE_SSHURI}:${REMOTE_STATIC_PATH}
  ssh -p 20001 ${REMOTE_SSHURI} "unzip -oq ${REMOTE_STATIC_PATH}/${STATIC_ZIPNAME} -d ${REMOTE_STATIC_PATH}"
  scp -P 20002 ${TMPDIR}/${STATIC_ZIPNAME} ${REMOTE_SSHURI}:${REMOTE_STATIC_PATH}
  ssh -p 20002 ${REMOTE_SSHURI} "unzip -oq ${REMOTE_STATIC_PATH}/${STATIC_ZIPNAME} -d ${REMOTE_STATIC_PATH}"
  echo 'cdn transfer done'
  rm -rf ${TMPDIR}/${STATIC_ZIPNAME}
  # cp ${TMPDIR}/${BUILD_ZIPNAME} ${REMOTE_BUILD_PATH}
  # unzip -oq ${REMOTE_BUILD_PATH}/${BUILD_ZIPNAME} -d ${REMOTE_BUILD_PATH}

  scp -P 20001 ${TMPDIR}/${BUILD_ZIPNAME} ${REMOTE_SSHURI}:${REMOTE_BUILD_PATH}
  ssh -p 20001 ${REMOTE_SSHURI} "unzip -oq ${REMOTE_BUILD_PATH}/${BUILD_ZIPNAME} -d ${REMOTE_BUILD_PATH}"
  scp -P 20002 ${TMPDIR}/${BUILD_ZIPNAME} ${REMOTE_SSHURI}:${REMOTE_BUILD_PATH}
  ssh -p 20002 ${REMOTE_SSHURI} "unzip -oq ${REMOTE_BUILD_PATH}/${BUILD_ZIPNAME} -d ${REMOTE_BUILD_PATH}"
  echo "publish done."
  rm -rf ${TMPDIR}/${BUILD_ZIPNAME}
else
	echo 'grunt dist error'
fi
