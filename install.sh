output=`mysql -u root < install.sql`


if [ -z "$output" ]; then
	echo "Empty Variable 1"
fi
